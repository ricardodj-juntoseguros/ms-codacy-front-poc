/* eslint-disable prefer-promise-reject-errors */
import '@testing-library/jest-dom';
import {
  BrokerPlatformAuthService,
  IncentiveTrailService,
  ProfileEnum,
} from '@services';
import { makeToast } from 'junto-design-system';
import { add } from 'date-fns';
import { fireEvent, render, waitFor } from '../../../config/testUtils';
import IncentiveTrailApi from '../../../application/features/incentiveTrail/IncentiveTrailApi';
import { IncentiveTrailStepStatusEnum } from '../../../application/types/model';
import IncentiveTrailContainer from './IncentiveTrailContainer';

jest.mock('junto-design-system', () => {
  const original = jest.requireActual('junto-design-system');
  return {
    ...original,
    makeToast: jest.fn(),
  };
});

describe('IncentiveTrailContainer', () => {
  process.env.NX_GLOBAL_BROKER_PROCESSES_URL = '/processes';
  let getIncentiveTrailCampaignMock: jest.SpyInstance;
  let getIncentiveTrailIsEligibleMock: jest.SpyInstance;
  let getIncentiveTrailIsAcceptMock: jest.SpyInstance;
  let getCampaignDataMock: jest.SpyInstance;

  Object.defineProperty(window, 'location', {
    writable: true,
    value: { assign: jest.fn() },
  });

  beforeEach(() => {
    jest
      .spyOn(BrokerPlatformAuthService, 'getBroker')
      .mockImplementation(() => ({
        id: 1,
        externalId: 9999,
        name: 'Test',
        userId: 1,
        federalId: '06465132135429',
        susepId: 0,
        user: {
          id: 1,
          userName: 'test',
          userType: 1,
          userTypeDescription: 'corretor',
        },
      }));
    jest
      .spyOn(BrokerPlatformAuthService, 'getUserProfile')
      .mockImplementation(() => ProfileEnum.BROKER);
    getIncentiveTrailCampaignMock = jest
      .spyOn(IncentiveTrailService, 'getIncentiveTrailCampaign')
      .mockImplementation(() => ({
        campaignId: 5,
        dateStart: new Date().toISOString(),
        dateEnd: add(new Date(), { days: 365 }).toISOString(),
        dateLimitRescue: add(new Date(), { days: 2 }).toISOString(),
        dateLimitAccept: add(new Date(), { days: 1 }).toISOString(),
        name: 'Jornada de Bônus 2024',
      }));
    getIncentiveTrailIsEligibleMock = jest
      .spyOn(IncentiveTrailService, 'getIncentiveTrailIsEligible')
      .mockImplementation(() => true);
    getIncentiveTrailIsAcceptMock = jest
      .spyOn(IncentiveTrailService, 'getIncentiveTrailIsAccept')
      .mockImplementation(() => true);
    getCampaignDataMock = jest
      .spyOn(IncentiveTrailApi, 'getCampaignData')
      .mockImplementation(() =>
        Promise.resolve({
          valueAccumulation: 75000,
          conquests: [
            {
              bonus: 150,
              accumulatedValue: 150000,
              isSurprise: true,
              percentageCompleted: 50,
              dateStartSurprise: '',
              dateEndSurprise: '',
              status: IncentiveTrailStepStatusEnum.unavailable,
              amountLeft: 75000,
              hasPayment: false,
              paymentAt: null,
              expirationDate: null,
            },
          ],
          dateProduction: new Date().toISOString(),
        }),
      );
  });

  it('should be able to render the steps and accumulated value correctly', async () => {
    const { getByText } = render(<IncentiveTrailContainer />);
    expect(getIncentiveTrailCampaignMock).toHaveBeenCalled();
    expect(getIncentiveTrailIsEligibleMock).toHaveBeenCalled();
    expect(getIncentiveTrailIsAcceptMock).toHaveBeenCalled();
    expect(getCampaignDataMock).toHaveBeenCalled();
    await waitFor(async () => {
      await expect(getByText('R$ 75.000,00')).toBeInTheDocument();
      await expect(getByText('R$ 150.000,00')).toBeInTheDocument();
      await expect(getByText('R$ 150,00')).toBeInTheDocument();
      await expect(getByText('50%')).toBeInTheDocument();
    });
  });

  it('should be able to open the modal for acceptance, automatically and when clicked on the alert', async () => {
    getIncentiveTrailIsAcceptMock = jest
      .spyOn(IncentiveTrailService, 'getIncentiveTrailIsAccept')
      .mockImplementation(() => false);
    const { getByTestId, getAllByText, queryByTestId } = render(
      <IncentiveTrailContainer />,
    );
    await expect(
      queryByTestId('incentiveTrailAcceptModal-form'),
    ).toBeInTheDocument();
    await waitFor(async () => {
      await fireEvent.click(getByTestId('modal-close-button'));
      await expect(
        queryByTestId('incentiveTrailAcceptModal-form'),
      ).not.toBeInTheDocument();
    });
    expect(getAllByText('R$ -').length).toEqual(10);
    await waitFor(async () => {
      await fireEvent.click(getByTestId('alert-linkButton'));
    });
    expect(
      await getByTestId('incentiveTrailAcceptModal-form'),
    ).toBeInTheDocument();
  });

  it('should be able to display an error message if the call fails', async () => {
    getCampaignDataMock = jest
      .spyOn(IncentiveTrailApi, 'getCampaignData')
      .mockImplementation(() =>
        Promise.reject({
          data: { message: 'error' },
        }),
      );
    const { getAllByText } = render(<IncentiveTrailContainer />);
    expect(getCampaignDataMock).toHaveBeenCalled();
    await waitFor(async () => {
      expect(getAllByText('R$ -').length).toEqual(10);
      expect(makeToast).toHaveBeenCalledWith(
        'error',
        'Houve um erro ao buscar os dados da campanha',
      );
    });
  });

  it('should be able to redirect a user who is not eligible', async () => {
    getIncentiveTrailIsEligibleMock = jest
      .spyOn(IncentiveTrailService, 'getIncentiveTrailIsEligible')
      .mockImplementation(() => false);
    render(<IncentiveTrailContainer />);
    expect(window.location.assign).toHaveBeenCalledWith('/processes');
  });
});

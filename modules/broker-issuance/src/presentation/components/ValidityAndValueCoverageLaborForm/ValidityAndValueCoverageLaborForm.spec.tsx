/* eslint-disable prefer-promise-reject-errors */
import '@testing-library/jest-dom';
import { addDays, startOfDay } from 'date-fns';
import { BrokerPlatformAuthService } from '@services';
import { parseDateToString } from '../../../helpers';
import QuotationPricingApi from '../../../application/features/quotationPricing/QuotationPricingApi';
import { quoteSliceActions } from '../../../application/features/quote/QuoteSlice';
import { store } from '../../../config/store';
import { fireEvent, render, waitFor } from '../../../config/testUtils';
import {
  brokerMock,
  modalityServiceProfiderPerformerMock,
  policyholderDetailsMock,
  quoteResultMock,
} from '../../../__mocks__';
import QuoteApi from '../../../application/features/quote/QuoteApi';
import ValidityAndValueCoverageLaborForm from './ValidityAndValueCoverageLaborForm';

const advanceStepMock = jest.fn();

jest.mock('@shared/hooks', () => {
  const originalModule = jest.requireActual('@shared/hooks');
  return {
    __esModule: true,
    ...originalModule,
    useFlow: () => ({
      advanceStep: advanceStepMock,
    }),
  };
});
jest.mock('@shared/utils', () => {
  const originalModule = jest.requireActual('@shared/utils');
  return {
    __esModule: true,
    ...originalModule,
    downloadFile: jest.fn(),
  };
});
jest.mock('junto-design-system', () => {
  const original = jest.requireActual('junto-design-system');
  return {
    ...original,
    makeToast: jest.fn(),
  };
});
describe('ValidityAndValueForm', () => {
  let getPolicyholderBalanceLimitsMock: jest.SpyInstance;
  const todayFormatted = parseDateToString(startOfDay(new Date()));

  beforeAll(() => {
    jest.setTimeout(20000);
  });

  beforeEach(() => {
    store.dispatch(quoteSliceActions.resetQuote());
    getPolicyholderBalanceLimitsMock = jest
      .spyOn(QuotationPricingApi, 'getPolicyholderBalanceLimits')
      .mockImplementation(() =>
        Promise.resolve({
          availableLimit: 10000,
          availableFlexibilizationLimit: 15000,
          showFlexibilizationLimit: true,
        }),
      );
    jest
      .spyOn(BrokerPlatformAuthService, 'getBroker')
      .mockReturnValue(brokerMock);
  });

  it('should be able to create quotation or update quotation and advance to next step', async () => {
    const postQuotation = jest
      .spyOn(QuoteApi, 'postQuotation')
      .mockImplementation(async () => quoteResultMock);
    const putQuotation = jest
      .spyOn(QuoteApi, 'putQuotation')
      .mockImplementation(async () => quoteResultMock);
    const downloadMock = jest
      .spyOn(QuoteApi, 'getQuotationDocument')
      .mockImplementation(async () => 'Ok');
    await store.dispatch(
      quoteSliceActions.setPolicyholder(
        policyholderDetailsMock.registrationData,
      ),
    );
    await store.dispatch(
      quoteSliceActions.setModality(modalityServiceProfiderPerformerMock),
    );
    let state = store.getState();
    const { getByTestId, getByText, findByTestId } = render(
      <ValidityAndValueCoverageLaborForm name="validityAndValueCoverageLaborForm" />,
    );
    await waitFor(async () => {
      await expect(getPolicyholderBalanceLimitsMock).toHaveBeenCalledWith(
        31832,
        97,
      );
      await expect(
        getByText('Limite disponível: R$ 15.000,00'),
      ).toBeInTheDocument();
    });
    expect(getByTestId('validityAndValueFooter-button-submit')).toBeDisabled();
    fireEvent.change(getByTestId('validityFields-dateinput-start-validity'), {
      target: { value: todayFormatted },
    });
    fireEvent.change(getByTestId('validityFields-dateinput-end-validity'), {
      target: {
        value: parseDateToString(startOfDay(addDays(new Date(), 30))),
      },
    });
    state = store.getState();
    expect(state.quote.startDateValidity).toBe(todayFormatted);
    expect(state.quote.endDateValidity).toBe(
      parseDateToString(startOfDay(addDays(new Date(), 30))),
    );
    expect(state.quote.durationInDays).toBe(30);
    fireEvent.change(getByTestId('securedAmount-input-securedAmount'), {
      target: { value: 12345 },
    });
    fireEvent.blur(getByTestId('securedAmount-input-securedAmount'));
    state = store.getState();
    await waitFor(async () => {
      await expect(state.quote.securedAmount).toBe(123.45);
      await expect(postQuotation).toHaveBeenCalled();
    });
    expect(getByText('R$ 190,00')).toBeInTheDocument();
    expect(getByText('R$ 38,00')).toBeInTheDocument();
    expect(getByText('20%')).toBeInTheDocument();
    expect(getByText('0,26%')).toBeInTheDocument();
    await waitFor(async () => {
      await fireEvent.click(getByTestId('flexRateToggle-toggle-input'));
    });
    const commissionFlex = await findByTestId(
      'feeCalculation-input-commissionFlex',
    );
    fireEvent.change(commissionFlex, { target: { value: '30,00' } });
    state = store.getState();
    expect(state.quote.toggleRateFlex).toBeTruthy();
    expect(state.quote.commissionFlex).toBe(30);
    fireEvent.click(getByTestId('coverageLabor-labor-toggle'));
    fireEvent.click(getByTestId('feeCalculation-button-calculate'));
    await waitFor(async () => {
      await expect(putQuotation).toHaveBeenCalled();
    });
    state = store.getState();
    expect(state.additionalCoverage.labor).toBeTruthy();
    expect(state.additionalCoverage.rateAggravation).toBeTruthy();
    fireEvent.click(getByTestId('validityAndValueFooter-button-download'));
    expect(downloadMock).toHaveBeenCalledWith(1868859);
    expect(
      getByTestId('validityAndValueFooter-button-submit'),
    ).not.toBeDisabled();
    fireEvent.click(getByTestId('validityAndValueFooter-button-submit'));
    expect(advanceStepMock).toHaveBeenCalledWith(
      'validityAndValueCoverageLaborForm',
    );
  });
});

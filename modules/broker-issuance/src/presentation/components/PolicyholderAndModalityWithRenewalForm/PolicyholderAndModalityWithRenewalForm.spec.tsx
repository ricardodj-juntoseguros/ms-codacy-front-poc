/* eslint-disable prefer-promise-reject-errors */
import '@testing-library/jest-dom';
import { BrokerPlatformAuthService } from '@services';
import { act } from 'react-dom/test-utils';
import {
  brokerMock,
  modalityBidderMock,
  policyholderDetailsMock,
  policyholderSearchMock,
} from '../../../__mocks__';
import { store } from '../../../config/store';
import { fireEvent, render, waitFor } from '../../../config/testUtils';
import PolicyholderSelectionApi from '../../../application/features/policyholderSelection/PolicyholderSelectionApi';
import ModalitySelecionApi from '../../../application/features/modalitySelection/ModalitySelecionApi';
import { quoteSliceActions } from '../../../application/features/quote/QuoteSlice';
import PolicyholderAndModalityWithRenewalForm from './PolicyholderAndModalityWithRenewalForm';
import { DEFAULT_STEP } from '../../../constants/steps';
import { PolicyRenewalTypeEnum } from '../../../application/types/model';

const advanceStepMock = jest.fn();
jest.mock('@shared/hooks', () => {
  const originalModule = jest.requireActual('@shared/hooks');
  return {
    __esModule: true,
    ...originalModule,
    useFlow: () => ({
      advanceStep: advanceStepMock,
      setSteps: jest.fn(),
      steps: [DEFAULT_STEP],
    }),
  };
});

describe('PolicyholderAndModalityWithRenewalForm', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(BrokerPlatformAuthService, 'getBroker')
      .mockReturnValue(brokerMock);
    store.dispatch(quoteSliceActions.resetQuote());
  });

  it('should be able to select the modality correctly', async () => {
    const searchMock = jest
      .spyOn(PolicyholderSelectionApi, 'searchPolicyHolder')
      .mockImplementation(() => Promise.resolve(policyholderSearchMock));
    const getPolicyholderDetailsMock = jest
      .spyOn(PolicyholderSelectionApi, 'getPolicyholderDetails')
      .mockImplementation(() => Promise.resolve(policyholderDetailsMock));
    const fetchModalitiesMock = jest
      .spyOn(ModalitySelecionApi, 'fetchModalities')
      .mockImplementation(() => Promise.resolve([modalityBidderMock]));
    const { getByTestId, getByText } = render(
      <PolicyholderAndModalityWithRenewalForm name="test" />,
    );
    const policyholderSearchInput = getByTestId(
      'policyholderSelection-input-search',
    );
    await act(async () => {
      await fireEvent.change(policyholderSearchInput, {
        target: { value: 'tomador' },
      });
    });
    await waitFor(() => {
      expect(searchMock).toHaveBeenCalledTimes(1);
    });
    const policyholderOption = getByText('99.999.999/9999-99 - Test');
    await act(async () => {
      await fireEvent.click(policyholderOption);
    });
    await waitFor(() => {
      expect(getPolicyholderDetailsMock).toHaveBeenCalledWith(
        9999,
        '99999999999999',
      );
      expect(fetchModalitiesMock).toHaveBeenCalledWith(
        '06465132135429',
        '97837181000147',
      );
    });
    const modalityOption = getByText('Licitante');
    await act(async () => {
      await fireEvent.click(modalityOption);
    });
    await waitFor(() => {
      const state = store.getState();
      expect(state.quote.modality).toEqual({
        ...modalityBidderMock,
        value: modalityBidderMock.id.toString(),
        label: modalityBidderMock.description,
      });
    });
  });

  it('should be able to proceed to the next step if everything is correct', async () => {
    const searchMock = jest
      .spyOn(PolicyholderSelectionApi, 'searchPolicyHolder')
      .mockImplementation(() => Promise.resolve(policyholderSearchMock));
    const getPolicyholderDetailsMock = jest
      .spyOn(PolicyholderSelectionApi, 'getPolicyholderDetails')
      .mockImplementation(() => Promise.resolve(policyholderDetailsMock));
    const fetchModalitiesMock = jest
      .spyOn(ModalitySelecionApi, 'fetchModalities')
      .mockImplementation(() => Promise.resolve([modalityBidderMock]));
    const { getByTestId, getByText } = render(
      <PolicyholderAndModalityWithRenewalForm name="test" />,
    );
    const policyholderSearchInput = getByTestId(
      'policyholderSelection-input-search',
    );
    await act(async () => {
      await fireEvent.change(policyholderSearchInput, {
        target: { value: 'tomador' },
      });
    });
    await waitFor(() => {
      expect(searchMock).toHaveBeenCalledTimes(1);
    });
    const policyholderOption = getByText('99.999.999/9999-99 - Test');
    await act(async () => {
      await fireEvent.click(policyholderOption);
    });
    await waitFor(() => {
      expect(getPolicyholderDetailsMock).toHaveBeenCalledWith(
        9999,
        '99999999999999',
      );
      expect(fetchModalitiesMock).toHaveBeenCalledWith(
        '06465132135429',
        '97837181000147',
      );
    });
    const modalityOption = getByText('Licitante');
    await act(async () => {
      await fireEvent.click(modalityOption);
    });
    const submitButton = getByTestId('policyholderAndModality-submit-button');
    await act(async () => {
      await fireEvent.click(submitButton);
    });
    expect(advanceStepMock).toHaveBeenCalledWith('test');
  });

  it('Should set if is a policy renewal proposal', async () => {
    const searchMock = jest
      .spyOn(PolicyholderSelectionApi, 'searchPolicyHolder')
      .mockImplementation(() => Promise.resolve(policyholderSearchMock));
    const getPolicyholderDetailsMock = jest
      .spyOn(PolicyholderSelectionApi, 'getPolicyholderDetails')
      .mockImplementation(() => Promise.resolve(policyholderDetailsMock));
    const fetchModalitiesMock = jest
      .spyOn(ModalitySelecionApi, 'fetchModalities')
      .mockImplementation(() => Promise.resolve([modalityBidderMock]));
    const { getByTestId, getByText, queryByTestId } = render(
      <PolicyholderAndModalityWithRenewalForm name="test" />,
    );
    await act(async () => {
      await fireEvent.change(
        getByTestId('policyholderSelection-input-search'),
        {
          target: { value: 'tomador' },
        },
      );
    });
    expect(queryByTestId('policyInProgress-toggle')).not.toBeInTheDocument();
    await waitFor(() => {
      expect(searchMock).toHaveBeenCalledTimes(1);
    });
    await act(async () => {
      await fireEvent.click(getByText('99.999.999/9999-99 - Test'));
    });
    await waitFor(() => {
      expect(getPolicyholderDetailsMock).toHaveBeenCalledWith(
        9999,
        '99999999999999',
      );
      expect(fetchModalitiesMock).toHaveBeenCalledWith(
        '06465132135429',
        '97837181000147',
      );
    });
    await fireEvent.click(getByTestId('policyRenewal-toggle-show'));
    const onGoingProcessRadio = getByTestId(
      'policyRenewal-onGoingProcess-radio-button',
    );
    await expect(onGoingProcessRadio).toBeInTheDocument();
    fireEvent.click(onGoingProcessRadio);
    const state = store.getState().policyRenewal;
    // Assert
    expect(state.isPolicyRenewal).toBe(true);
    expect(state.policyRenewalType).toBe(PolicyRenewalTypeEnum.OnGoingProcess);
  });

  it('should be able to render appointment letter upload when linked broker error', async () => {
    jest
      .spyOn(PolicyholderSelectionApi, 'searchPolicyHolder')
      .mockImplementation(() => Promise.resolve(policyholderSearchMock));
    const getPolicyholderDetailsMock = jest
      .spyOn(PolicyholderSelectionApi, 'getPolicyholderDetails')
      .mockImplementation(() =>
        Promise.reject({
          data: {
            message:
              'Erro ao trazer detalhes do tomador, empresa está vinculada a outro corretor',
          },
        }),
      );
    const { getByTestId, getByText } = render(
      <PolicyholderAndModalityWithRenewalForm name="test" />,
    );
    await act(async () => {
      fireEvent.change(getByTestId('policyholderSelection-input-search'), {
        target: { value: '99999999999999' },
      });
    });
    await act(async () => {
      fireEvent.click(getByText('99.999.999/9999-99 - Test'));
    });
    await waitFor(() => {
      expect(getPolicyholderDetailsMock).toHaveBeenCalledWith(
        9999,
        '99999999999999',
      );
    });
    expect(
      getByTestId('policyholderAppointmentLetter-submit-button'),
    ).toBeInTheDocument();
  });
});

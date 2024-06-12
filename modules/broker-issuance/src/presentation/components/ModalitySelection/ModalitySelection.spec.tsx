import '@testing-library/jest-dom';
import Cookies from 'js-cookie';
import { BrokerPlatformAuthService, ProfileEnum } from '@services';
import { fireEvent, render, waitFor, act } from '../../../config/testUtils';
import ModalitySelecionApi from '../../../application/features/modalitySelection/ModalitySelecionApi';
import {
  brokerMock,
  modalityBidderMock,
  policyholderDetailsMock,
} from '../../../__mocks__';
import { store } from '../../../config/store';
import { quoteSliceActions } from '../../../application/features/quote/QuoteSlice';
import { DEFAULT_STEP } from '../../../constants/steps';
import ModalitySelection from './ModalitySelection';

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

describe('ModalitySelection', () => {
  const windowOpen = jest.fn();
  window.open = windowOpen;
  process.env.NX_GLOBAL_BROKER_HELP_URL = 'NX_GLOBAL_BROKER_HELP_URL';
  process.env.NX_GLOBAL_MODALITIES_EXPRESS = 'NX_GLOBAL_MODALITIES_EXPRESS';
  process.env.NX_GLOBAL_MODALITIES_EXPRESS_POLICYHOLDER =
    'NX_GLOBAL_MODALITIES_EXPRESS_POLICYHOLDER';
  const cookieSetMock = jest.spyOn(Cookies, 'set');
  let getModalityOptionsMock: jest.SpyInstance;

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: '' },
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    getModalityOptionsMock = jest
      .spyOn(ModalitySelecionApi, 'fetchModalities')
      .mockImplementation(() => Promise.resolve([modalityBidderMock]));
    jest
      .spyOn(BrokerPlatformAuthService, 'getBroker')
      .mockReturnValue(brokerMock);
    jest
      .spyOn(BrokerPlatformAuthService, 'getUserProfile')
      .mockImplementation(() => ProfileEnum.BROKER);
  });

  it('should be able to select the modality correctly', async () => {
    // Arrange
    await store.dispatch(
      quoteSliceActions.setPolicyholder(
        policyholderDetailsMock.registrationData,
      ),
    );
    const { getByTestId, getByText } = render(<ModalitySelection />);
    // Act
    await act(async () => {
      await fireEvent.click(getByTestId('modalitySelection-input-dropdown'));
    });
    const modalityOption = getByText('Licitante');
    await act(async () => {
      await fireEvent.click(modalityOption);
    });
    // Assert
    await waitFor(() => {
      const state = store.getState();
      expect(state.quote.modality).toEqual({
        ...modalityBidderMock,
        value: modalityBidderMock.id.toString(),
        label: modalityBidderMock.description,
      });
    });
  });

  it('should be able to redirect modality help', async () => {
    // Arrange
    await store.dispatch(
      quoteSliceActions.setPolicyholder(
        policyholderDetailsMock.registrationData,
      ),
    );
    const { getByTestId } = render(<ModalitySelection />);
    // Act
    await act(async () => {
      await fireEvent.click(getByTestId('modalitySelection-link-button-about'));
    });
    // Assert
    expect(cookieSetMock).toHaveBeenCalled();
    await waitFor(() => {
      expect(windowOpen).toHaveBeenCalledWith(
        'NX_GLOBAL_BROKER_HELP_URL',
        '_blank',
      );
    });
  });

  it('should not be able a get modality option if not broker', async () => {
    // Arrange
    await store.dispatch(
      quoteSliceActions.setPolicyholder(
        policyholderDetailsMock.registrationData,
      ),
    );
    jest.spyOn(BrokerPlatformAuthService, 'getBroker').mockReturnValue(null);
    render(<ModalitySelection />);
    // Act
    // Assert
    expect(getModalityOptionsMock).not.toHaveBeenCalled();
  });

  it('should be able to redirect to the legacy flow if the chosen modality does not have steps', async () => {
    // Arrange
    await store.dispatch(
      quoteSliceActions.setPolicyholder(
        policyholderDetailsMock.registrationData,
      ),
    );
    getModalityOptionsMock = jest
      .spyOn(ModalitySelecionApi, 'fetchModalities')
      .mockImplementation(() =>
        Promise.resolve([{ ...modalityBidderMock, id: 999 }]),
      );
    const { getByTestId, getByText } = render(<ModalitySelection />);
    // Act
    await act(async () => {
      await fireEvent.click(getByTestId('modalitySelection-input-dropdown'));
    });
    const modalityOption = getByText('Licitante');
    await act(async () => {
      await fireEvent.click(modalityOption);
    });
    // Assert
    await waitFor(() => {
      const state = store.getState();
      expect(state.quote.modality).toEqual({
        ...modalityBidderMock,
        id: 999,
        value: '999',
        label: modalityBidderMock.description,
      });
    });
    expect(cookieSetMock).toHaveBeenCalled();
    expect(window.location.href).toEqual('NX_GLOBAL_MODALITIES_EXPRESS');
  });

  it('should be able to redirect to the legacy flow for the policyholder if the chosen modality does not have steps', async () => {
    // Arrange
    await store.dispatch(
      quoteSliceActions.setPolicyholder(
        policyholderDetailsMock.registrationData,
      ),
    );
    jest
      .spyOn(BrokerPlatformAuthService, 'getUserProfile')
      .mockImplementation(() => ProfileEnum.POLICYHOLDER);
    getModalityOptionsMock = jest
      .spyOn(ModalitySelecionApi, 'fetchModalities')
      .mockImplementation(() =>
        Promise.resolve([{ ...modalityBidderMock, id: 999 }]),
      );
    const { getByTestId, getByText, queryByTestId } = render(
      <ModalitySelection />,
    );
    // Act
    await act(async () => {
      await fireEvent.click(getByTestId('modalitySelection-input-dropdown'));
    });
    const modalityOption = getByText('Licitante');
    await act(async () => {
      await fireEvent.click(modalityOption);
    });
    // Assert
    await waitFor(() => {
      const state = store.getState();
      expect(state.quote.modality).toEqual({
        ...modalityBidderMock,
        id: 999,
        value: '999',
        label: modalityBidderMock.description,
      });
    });
    expect(cookieSetMock).toHaveBeenCalled();
    expect(window.location.href).toEqual(
      'NX_GLOBAL_MODALITIES_EXPRESS_POLICYHOLDER',
    );
    expect(
      await queryByTestId('modalitySelection-link-button-about'),
    ).not.toBeInTheDocument();
  });
});

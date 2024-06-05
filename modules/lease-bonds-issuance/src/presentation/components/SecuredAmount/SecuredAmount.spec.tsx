import '@testing-library/jest-dom';
import { makeToast } from 'junto-design-system';
import { store } from '../../../config/store';
import { quoteSliceActions } from '../../../application/features/quote/QuoteSlice';
import {
  modalityServiceProfiderPerformerMock,
  policyholderDetailsMock,
} from '../../../__mocks__';
import { fireEvent, render, waitFor } from '../../../config/testUtils';
import QuotationPricingApi from '../../../application/features/quotationPricing/QuotationPricingApi';
import SecuredAmount from './SecuredAmount';

jest.mock('junto-design-system', () => {
  const original = jest.requireActual('junto-design-system');
  return {
    ...original,
    makeToast: jest.fn(),
  };
});

const mockHook = jest.fn();
jest.mock('../../hooks', () => {
  const rest = jest.requireActual('../../hooks');
  return {
    ...rest,
    useQuotation: () => mockHook,
  };
});

describe('SecuredAmount', () => {
  let getPolicyholderBalanceLimitsMock: jest.SpyInstance;

  beforeEach(() => {
    getPolicyholderBalanceLimitsMock = jest
      .spyOn(QuotationPricingApi, 'getPolicyholderBalanceLimits')
      .mockImplementation(() =>
        Promise.resolve({
          availableLimit: 10000,
          availableFlexibilizationLimit: 15000,
          showFlexibilizationLimit: true,
        }),
      );
  });

  it('should be able to show the available flexible limit', async () => {
    await store.dispatch(
      quoteSliceActions.setPolicyholder(
        policyholderDetailsMock.registrationData,
      ),
    );
    await store.dispatch(
      quoteSliceActions.setModality(modalityServiceProfiderPerformerMock),
    );
    const { getByText } = render(<SecuredAmount title="test" />);
    expect(getByText('Limite disponível: Carregando...')).toBeInTheDocument();
    await waitFor(async () => {
      await expect(getPolicyholderBalanceLimitsMock).toHaveBeenCalledWith(
        31832,
        97,
      );
      await expect(
        getByText('Limite disponível: R$ 15.000,00'),
      ).toBeInTheDocument();
    });
  });

  it('should be able to show the available limit', async () => {
    getPolicyholderBalanceLimitsMock = jest
      .spyOn(QuotationPricingApi, 'getPolicyholderBalanceLimits')
      .mockImplementation(() =>
        Promise.resolve({
          availableLimit: 10000,
          availableFlexibilizationLimit: 15000,
          showFlexibilizationLimit: false,
        }),
      );
    await store.dispatch(
      quoteSliceActions.setPolicyholder(
        policyholderDetailsMock.registrationData,
      ),
    );
    await store.dispatch(
      quoteSliceActions.setModality(modalityServiceProfiderPerformerMock),
    );
    const { getByText } = render(<SecuredAmount title="test" />);
    expect(getByText('Limite disponível: Carregando...')).toBeInTheDocument();
    await waitFor(async () => {
      await expect(getPolicyholderBalanceLimitsMock).toHaveBeenCalledWith(
        31832,
        97,
      );
      await expect(
        getByText('Limite disponível: R$ 10.000,00'),
      ).toBeInTheDocument();
    });
  });

  it('should be able to call the handleSecuredAmount function', async () => {
    getPolicyholderBalanceLimitsMock = jest
      .spyOn(QuotationPricingApi, 'getPolicyholderBalanceLimits')
      .mockImplementation(() => Promise.reject());
    await store.dispatch(
      quoteSliceActions.setPolicyholder(
        policyholderDetailsMock.registrationData,
      ),
    );
    await store.dispatch(
      quoteSliceActions.setModality(modalityServiceProfiderPerformerMock),
    );
    render(<SecuredAmount title="test" />);
    await waitFor(async () => {
      expect(makeToast).toHaveBeenCalledWith(
        'error',
        'Ocorreu um erro ao buscar o limite deste tomador para a modalidade selecionada.',
      );
    });
  });

  it('should be able to call the handleSecuredAmount function', async () => {
    const { getByTestId } = render(<SecuredAmount title="test" />);
    const input = getByTestId('securedAmount-input-securedAmount');
    await fireEvent.change(input, { target: { value: 12345 } });
    fireEvent.blur(input);
    const state = store.getState();
    await waitFor(async () => {
      await expect(state.quote.securedAmount).toBe(123.45);
      await expect(mockHook).toHaveBeenCalled();
    });
  });
});

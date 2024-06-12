import '@testing-library/jest-dom';
import { act, fireEvent, render, waitFor } from '../../../config/testUtils';
import { store } from '../../../config/store';
import { AFFILIATE_DEFAULT_OPTIONS } from '../../../constants';
import {
  createQuoteMock,
  policyholderDetailsMock,
  quoteResultMock,
} from '../../../__mocks__';
import {
  postQuotation,
  quoteSliceActions,
} from '../../../application/features/quote/QuoteSlice';
import QuoteApi from '../../../application/features/quote/QuoteApi';
import { policyholderSelectionActions } from '../../../application/features/policyholderSelection/PolicyholderSelectionSlice';
import PolicyholderAffiliateSelection from './PolicyholderAffiliateSelection';

const mockHook = jest.fn();
jest.mock('../../hooks', () => {
  const rest = jest.requireActual('../../hooks');
  return {
    ...rest,
    useQuotation: () => mockHook,
  };
});

describe('PolicyholderAffiliateSelection', () => {
  beforeAll(async () => {
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

  it('should be able to select policyholder affiliate', async () => {
    await store.dispatch(
      quoteSliceActions.setPolicyholder(
        policyholderDetailsMock.registrationData,
      ),
    );
    await store.dispatch(
      policyholderSelectionActions.setPolicyholderAffiliatesOptions(
        policyholderDetailsMock.affiliates,
      ),
    );
    const { getByText } = render(
      <PolicyholderAffiliateSelection loadingPolicyholderDetails={false} />,
    );
    await act(async () => {
      fireEvent.click(getByText('BOTUCATU - SP - CNPJ: 97.837.181/0020-00'));
    });
    await waitFor(() => {
      const state = store.getState();
      expect(state.quote.policyholderAffiliate?.id).toEqual(
        policyholderDetailsMock.affiliates[0].id,
      );
      expect(state.quote.policyholderAffiliate?.companyName).toEqual(
        policyholderDetailsMock.affiliates[0].companyName,
      );
      expect(state.quote.policyholderAffiliate?.federalId).toEqual(
        policyholderDetailsMock.affiliates[0].federalId,
      );
      expect(state.quote.policyholderAffiliate?.city).toEqual(
        policyholderDetailsMock.affiliates[0].city,
      );
      expect(state.quote.policyholderAffiliate?.state).toEqual(
        policyholderDetailsMock.affiliates[0].state,
      );
    });
  });

  it('Should update current quote on affiliate change', async () => {
    await store.dispatch(
      quoteSliceActions.setPolicyholder(
        policyholderDetailsMock.registrationData,
      ),
    );
    await store.dispatch(
      policyholderSelectionActions.setPolicyholderAffiliatesOptions(
        policyholderDetailsMock.affiliates,
      ),
    );
    jest
      .spyOn(QuoteApi, 'postQuotation')
      .mockImplementation(async () => quoteResultMock);
    await store.dispatch(postQuotation(createQuoteMock));
    const { getByText } = render(
      <PolicyholderAffiliateSelection loadingPolicyholderDetails={false} />,
    );
    await act(async () => {
      fireEvent.click(getByText('BOTUCATU - SP - CNPJ: 97.837.181/0020-00'));
    });
    expect(mockHook).toHaveBeenCalled();
  });

  it('should be able to render not found affiliate alert', async () => {
    await store.dispatch(
      quoteSliceActions.setPolicyholder(
        policyholderDetailsMock.registrationData,
      ),
    );
    await store.dispatch(
      policyholderSelectionActions.setPolicyholderAffiliatesOptions(
        policyholderDetailsMock.affiliates,
      ),
    );
    const { getByText, findByText } = render(
      <PolicyholderAffiliateSelection loadingPolicyholderDetails={false} />,
    );
    await act(async () => {
      await fireEvent.click(getByText('Não encontrei minha filial'));
    });
    const state = store.getState();
    const alert = await findByText(
      'Seguiremos sua proposta com os dados da Matriz. Caso necessite cadastrar uma nova filial, entre em contato',
    );
    expect(state.quote.policyholderAffiliate).toEqual(
      AFFILIATE_DEFAULT_OPTIONS.notFoundAffiliate,
    );
    expect(alert).toBeInTheDocument();
  });
});

import {
  policyholderMock,
  storeMock,
  policyholderAffiliateMock,
  quoteResultMock,
  createQuoteMock,
} from '../../../__mocks__';
import { store } from '../../../config/store';
import QuoteApi from './QuoteApi';
import { postQuotation, putQuotation, quoteSliceActions } from './QuoteSlice';

describe('QuoteSlice', () => {
  beforeEach(() => {
    store.dispatch(quoteSliceActions.resetQuote());
  });

  it('should be able to fill in all fields of the quote', async () => {
    const subsidiarySelectedMock = {
      ...policyholderAffiliateMock,
      label: 'Curitiba - PR - 99999999999999',
      value: '4460',
    };
    store.dispatch(quoteSliceActions.setPolicyholder(policyholderMock));
    store.dispatch(
      quoteSliceActions.setModality(
        storeMock.modalitySelecion.modalityOptions[0],
      ),
    );
    store.dispatch(
      quoteSliceActions.setPolicyholderAffiliate(subsidiarySelectedMock),
    );
    store.dispatch(quoteSliceActions.setStartDateValidity('27/05/2022'));
    store.dispatch(quoteSliceActions.setEndDateValidity('27/05/2023'));
    store.dispatch(quoteSliceActions.setDurationInDays(365));
    store.dispatch(quoteSliceActions.setSecuredAmount(1000));
    store.dispatch(quoteSliceActions.setProposalFee(1.87));

    const { quote } = store.getState();

    expect(quote.policyholder).toEqual(policyholderMock);
    expect(quote.modality).toEqual(
      storeMock.modalitySelecion.modalityOptions[0],
    );
    expect(quote.policyholderAffiliate).toEqual(subsidiarySelectedMock);
    expect(quote.startDateValidity).toEqual('27/05/2022');
    expect(quote.endDateValidity).toEqual('27/05/2023');
    expect(quote.durationInDays).toEqual(365);
    expect(quote.securedAmount).toEqual(1000);
    expect(quote.proposalFee).toEqual(1.87);
    expect(quote.hasQuoteChanges).toEqual(true);
  });

  it('postQuotation thunk should call api and alter store with values', async () => {
    const apiMock = jest
      .spyOn(QuoteApi, 'postQuotation')
      .mockImplementation(async () => quoteResultMock);

    await store.dispatch(postQuotation(createQuoteMock));

    expect(apiMock).toHaveBeenCalledWith(createQuoteMock);
    const state = store.getState().quote;
    expect(state.currentQuote).toBeTruthy();
    expect(state.currentQuote?.identification.ProposalId).toEqual(90408);
    expect(state.proposalFee).toEqual(0.26);
    expect(state.loadingQuote).toBeFalsy();
    expect(state.hasQuoteChanges).toBeFalsy();
  });

  it('postQuotation thunk should not set values if api call fails', async () => {
    jest
      .spyOn(QuoteApi, 'postQuotation')
      .mockImplementation(async () => Promise.reject(new Error('test error')));

    await store.dispatch(postQuotation(createQuoteMock));
    const state = store.getState().quote;
    expect(state.currentQuote).toBe(null);
    expect(state.proposalFee).toEqual(NaN);
    expect(state.loadingQuote).toBeFalsy();
    expect(state.hasQuoteChanges).toBeTruthy();
  });

  it('putQuotation thunk should call api and alter store with values', async () => {
    const apiMock = jest
      .spyOn(QuoteApi, 'putQuotation')
      .mockImplementation(async () => quoteResultMock);

    await store.dispatch(
      putQuotation({
        proposalId: 12345,
        quoteData: createQuoteMock,
      }),
    );

    expect(apiMock).toHaveBeenCalledWith(12345, createQuoteMock);
    const state = store.getState().quote;
    expect(state.currentQuote).toBeTruthy();
    expect(state.currentQuote?.identification.ProposalId).toEqual(90408);
    expect(state.proposalFee).toEqual(0.26);
    expect(state.loadingQuote).toBeFalsy();
    expect(state.hasQuoteChanges).toBeFalsy();
  });

  it('put thunk should not set values if api call fails', async () => {
    jest
      .spyOn(QuoteApi, 'putQuotation')
      .mockImplementation(async () => Promise.reject(new Error('test error')));

    await store.dispatch(
      putQuotation({ proposalId: 12345, quoteData: createQuoteMock }),
    );
    const state = store.getState().quote;
    expect(state.currentQuote).toBe(null);
    expect(state.proposalFee).toEqual(NaN);
    expect(state.loadingQuote).toBeFalsy();
    expect(state.hasQuoteChanges).toBeTruthy();
  });
});

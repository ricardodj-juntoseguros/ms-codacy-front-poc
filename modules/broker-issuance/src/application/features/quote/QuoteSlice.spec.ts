import {
  policyholderLimitMock,
  policyholderMock,
  storeMock,
  policyholderAffiliateMock,
  quoteResulMock,
  quoteMock,
} from '../../../__mocks__';
import { store } from '../../../config/store';
import { generateQuote, quoteSliceActions } from './QuoteSlice';
import { policyholderLimitAdapter } from '../coverageData/adapters';
import QuoteApi from './QuoteApi';

describe('ModalitySelectionSlice', () => {
  beforeEach(() => {
    store.dispatch(quoteSliceActions.resetQuote());
  });

  it('should be able to fill in all fields of the quote', async () => {
    const subsidiarySelectedMock = {
      ...policyholderAffiliateMock,
      label: 'Curitiba - PR - 99999999999999',
      value: '4460',
    };
    const policyHolderLimitResult = policyholderLimitAdapter(
      policyholderLimitMock,
    );

    store.dispatch(quoteSliceActions.setPolicyholder(policyholderMock));
    store.dispatch(
      quoteSliceActions.setModality(
        storeMock.modalitySelecion.modalityOptions[0],
      ),
    );
    store.dispatch(quoteSliceActions.setPolicyholderAffiliate(subsidiarySelectedMock));
    store.dispatch(
      quoteSliceActions.setPolicyholderLimit(policyHolderLimitResult),
    );
    store.dispatch(quoteSliceActions.setStartDate('27/05/2022'));
    store.dispatch(quoteSliceActions.setEndDate('27/05/2023'));
    store.dispatch(quoteSliceActions.setDurationInDays(365));
    store.dispatch(quoteSliceActions.setSecuredAmount(1000));
    store.dispatch(quoteSliceActions.setProposalFee(1.87));
    store.dispatch(quoteSliceActions.setFeeFlex(1.92));
    store.dispatch(quoteSliceActions.setCommissionFlex(100));

    const { quote } = store.getState();

    expect(quote.policyholder).toEqual(policyholderMock);
    expect(quote.modality).toEqual(
      storeMock.modalitySelecion.modalityOptions[0],
    );
    expect(quote.policyholderAffiliate).toEqual(subsidiarySelectedMock);
    expect(quote.policyholderLimit).toEqual(policyHolderLimitResult);
    expect(quote.coverageData.startDate).toEqual('27/05/2022');
    expect(quote.coverageData.endDate).toEqual('27/05/2023');
    expect(quote.coverageData.durationInDays).toEqual(365);
    expect(quote.coverageData.securedAmount).toEqual(1000);
    expect(quote.pricing.proposalFee).toEqual(1.87);
    expect(quote.pricing.feeFlex).toEqual(1.92);
    expect(quote.pricing.commissionFlex).toEqual(100);
    expect(quote.hasQuoteChanges).toEqual(true);
  });

  it('should be able to generate quote', async () => {
    const policyholderSearchApiMock = jest
      .spyOn(QuoteApi, 'generateQuote')
      .mockImplementation(() => Promise.resolve(quoteResulMock));
    const pricingResult = {
      ...quoteResulMock.pricing,
      feeFlex: 1.87,
      totalPrize: quoteResulMock.quote.totalPrize,
      proposalFee: 1.87,
      commissionFlex: 57,
    };

    await store.dispatch(generateQuote(quoteMock));

    const { quote } = store.getState();

    expect(policyholderSearchApiMock).toHaveBeenCalled();
    expect(policyholderSearchApiMock).toHaveBeenCalledWith(quoteMock);
    expect(quote.pricing).toMatchObject(pricingResult);
    expect(quote.identification).toMatchObject(
      quoteResulMock.quote.identification,
    );
    expect(quote.installments).toMatchObject(
      quoteResulMock.pricing.installmentOptions,
    );
    expect(quote.loadingQuote).toEqual(false);
    expect(quote.hasQuoteChanges).toEqual(false);
  });

  it('should be able to generate quote with flex rate or flex commission', async () => {
    const quoteResulFlex = {
      ...quoteResulMock,
      quote: {
        ...quoteResulMock.quote,
        feeFlex: 2.0,
      },
      pricing: {
        ...quoteResulMock.pricing,
        commissionFlex: 120,
      },
    };
    const policyholderSearchApiMock = jest
      .spyOn(QuoteApi, 'generateQuote')
      .mockImplementation(() => Promise.resolve(quoteResulFlex));

    const pricingResult = {
      ...quoteResulMock.pricing,
      feeFlex: 2.0,
      totalPrize: quoteResulMock.quote.totalPrize,
      proposalFee: 1.87,
      commissionFlex: 120,
    };

    await store.dispatch(generateQuote(quoteMock));

    const { quote } = store.getState();

    expect(policyholderSearchApiMock).toHaveBeenCalled();
    expect(policyholderSearchApiMock).toHaveBeenCalledWith(quoteMock);
    expect(quote.pricing).toMatchObject(pricingResult);
    expect(quote.identification).toMatchObject(
      quoteResulMock.quote.identification,
    );
    expect(quote.installments).toMatchObject(
      quoteResulMock.pricing.installmentOptions,
    );
    expect(quote.loadingQuote).toEqual(false);
    expect(quote.hasQuoteChanges).toEqual(false);
  });

  it('Should not update quote if the error call', async () => {
    const policyholderSearchApiMock = jest
      .spyOn(QuoteApi, 'generateQuote')
      .mockImplementation(() => Promise.reject(new Error('Not found')));

    await store.dispatch(generateQuote(quoteMock));

    const { quote } = store.getState();

    expect(policyholderSearchApiMock).toHaveBeenCalled();
    expect(policyholderSearchApiMock).toHaveBeenCalledWith(quoteMock);
    expect(quote.identification).toEqual(null);
    expect(quote.installments).toEqual([]);
    expect(quote.loadingQuote).toEqual(false);
    expect(quote.hasQuoteChanges).toEqual(false);
  });
});

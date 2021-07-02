import { createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { QuoteResultDTO } from '../../../types/dto/QuoteResultDTO';
import { QuoteModel, TimeframeAndCoverageModel } from '../../../types/model';
import QuoteApi from '../QuoteApi';

export const generateQuote = createAsyncThunk(
  'quote/generateQuote',
  async (rateData: TimeframeAndCoverageModel) => {
    return await QuoteApi.generateQuote(rateData);
  },
);

export function generateQuotePending(state: QuoteModel) {
  state.loadingQuote = true;
}

export function generateQuoteFulFilled(
  state: QuoteModel,
  data: PayloadAction<QuoteResultDTO>,
) {
  state.loadingQuote = false;
  state.pricing = {
    commissionFee: data.payload.commissionFee,
    commissionValue: data.payload.commissionValue,
    feeStandard: data.payload.feeStandard,
    finalPrize: data.payload.finalPrize,
    maxRate: data.payload.maxRate,
  };

  state.installments = data.payload.installments;
}

export function generateQuoteRejected(state: QuoteModel) {
  state.loadingQuote = false;
}

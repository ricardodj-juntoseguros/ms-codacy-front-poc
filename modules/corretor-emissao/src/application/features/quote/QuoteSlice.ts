import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../config/store';
import {
  PolicyholderModel,
  ModalityModel,
  SubsidiaryModel,
  QuoteModel,
  TimeframeAndCoverageModel,
} from '../../types/model';

const initialState: QuoteModel = {
  policyholder: null,
  modality: null,
  subsidiary: null,
  timeframeAndCoverage: null,
};

export const quoteSlice = createSlice({
  name: 'quote',
  initialState,
  reducers: {
    setPolicyholder: (
      state,
      action: PayloadAction<PolicyholderModel | null>,
    ) => {
      state.policyholder = action.payload;
    },
    setModality: (state, action: PayloadAction<ModalityModel | null>) => {
      state.modality = action.payload;
    },
    setSubsidiary: (state, action: PayloadAction<SubsidiaryModel | null>) => {
      state.subsidiary = action.payload;
    },
    setTimeframeAndCoverageData: (
      state,
      action: PayloadAction<TimeframeAndCoverageModel | null>,
    ) => {
      state.timeframeAndCoverage = action.payload;
    },
  },
});

export const selectQuote = (state: RootState) => state.quote;

export const {
  setPolicyholder,
  setModality,
  setSubsidiary,
  setTimeframeAndCoverageData,
} = quoteSlice.actions;

export default quoteSlice.reducer;

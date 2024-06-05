import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../config/store';
import { AdditionalCoverageModel } from '../../types/model';

const initialState: AdditionalCoverageModel = {
  labor: false,
  rateAggravation: false,
  hasAdditionalCoverageChanges: false,
};

export const AdditionalCoverageSlice = createSlice({
  name: 'additionalCoverage',
  initialState,
  reducers: {
    setLabor: (state, action) => {
      state.labor = action.payload;
      state.rateAggravation = !!action.payload;
      state.hasAdditionalCoverageChanges = true;
    },
    setRateAggravation: (state, action) => {
      state.rateAggravation = action.payload;
      state.hasAdditionalCoverageChanges = true;
    },
    setHasAdditionalCoverageChanges: (state, action) => {
      state.hasAdditionalCoverageChanges = action.payload;
    },
    clearAdditionalCoverage: state => {
      state.labor = false;
      state.rateAggravation = false;
      state.hasAdditionalCoverageChanges = false;
    },
  },
});

export const selectAdditionalCoverage = (state: RootState) =>
  state.additionalCoverage;

export const { actions: additionalCoverageActions } = AdditionalCoverageSlice;

export default AdditionalCoverageSlice.reducer;

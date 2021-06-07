import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../config/store';

import { TimeframeAndCoverageModel } from '../../types/model';

const initialState: TimeframeAndCoverageModel = {
  timeframeStart: null,
  timeframeEnd: null,
  durationInDays: 0,
  coverageValue: 0,
  policyholderLimit: 0,
};

export const timeframeAndCoverageSlice = createSlice({
  name: 'timeframeAndCoverage',
  initialState,
  reducers: {
    setFormData: (state, action: PayloadAction<TimeframeAndCoverageModel>) => {
      state.timeframeStart = action.payload.timeframeStart;
      state.timeframeEnd = action.payload.timeframeEnd;
      state.durationInDays = action.payload.durationInDays;
      state.coverageValue = action.payload.coverageValue;
      state.policyholderLimit = action.payload.policyholderLimit;
    },
    reset: state => {
      state.timeframeStart = null;
      state.timeframeEnd = null;
      state.durationInDays = 0;
      state.coverageValue = 0;
      state.policyholderLimit = 0;
    },
  },
});

export const selectTimeframeAndCoverage = (state: RootState) =>
  state.timeframeAndCoverage;

export const { setFormData, reset } = timeframeAndCoverageSlice.actions;

export default timeframeAndCoverageSlice.reducer;

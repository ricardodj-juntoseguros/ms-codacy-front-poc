import { configureStore } from '@reduxjs/toolkit';
import PolicyholderAndModalitySearchSlice from '../application/features/policyholderAndModalitySearch/PolicyholderAndModalitySearchSlice';
import TimeframeAndCoverageSlice from '../application/features/timeframeAndCoverage/TimeframeAndCoverageSlice';

export const store = configureStore({
  reducer: {
    policyholderAndModalitySearch: PolicyholderAndModalitySearchSlice,
    timeframeAndCoverage: TimeframeAndCoverageSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

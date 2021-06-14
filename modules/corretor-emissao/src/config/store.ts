import { configureStore } from '@reduxjs/toolkit';
import FlowSlice from '../application/features/flow/FlowSlice';
import SearchInsuredSlice from '../application/features/searchInsured/SearchInsuredSlice';
import PolicyholderAndModalitySearchSlice from '../application/features/policyholderAndModalitySearch/PolicyholderAndModalitySearchSlice';
import QuoteSlice from '../application/features/quote/QuoteSlice';

export const store = configureStore({
  reducer: {
    quote: QuoteSlice,
    flow: FlowSlice,
    policyholderAndModalitySearch: PolicyholderAndModalitySearchSlice,
    searchInsured: SearchInsuredSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

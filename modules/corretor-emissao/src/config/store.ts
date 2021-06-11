import { configureStore } from '@reduxjs/toolkit';
import SearchInsuredSlice from '../application/features/searchInsured/SearchInsuredSlice';
import PolicyholderAndModalitySearchSlice from '../application/features/policyholderAndModalitySearch/PolicyholderAndModalitySearchSlice';
import QuoteSlice from '../application/features/quote/QuoteSlice';

export const store = configureStore({
  reducer: {
    quote: QuoteSlice,
    policyholderAndModalitySearch: PolicyholderAndModalitySearchSlice,
    searchInsured: SearchInsuredSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

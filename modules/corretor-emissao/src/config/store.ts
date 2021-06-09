import { configureStore } from '@reduxjs/toolkit';
import PolicyholderAndModalitySearchSlice from '../application/features/policyholderAndModalitySearch/PolicyholderAndModalitySearchSlice';
import QuoteSlice from '../application/features/quote/QuoteSlice';

export const store = configureStore({
  reducer: {
    quote: QuoteSlice,
    policyholderAndModalitySearch: PolicyholderAndModalitySearchSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

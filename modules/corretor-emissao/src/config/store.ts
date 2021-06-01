import { configureStore } from '@reduxjs/toolkit';
import PolicyholderAndModalitySearchSlice from '../application/features/policyholderAndModalitySearch/PolicyholderAndModalitySearchSlice';

export const store = configureStore({
  reducer: {
    policyholderAndModalitySearch: PolicyholderAndModalitySearchSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

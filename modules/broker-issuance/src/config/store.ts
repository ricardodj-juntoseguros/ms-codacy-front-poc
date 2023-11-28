import { configureStore } from '@reduxjs/toolkit';
import SearchInsuredSlice from '../application/features/searchInsured/SearchInsuredSlice';
import ModalitySlice from '../application/features/modalitySelection/ModalitySelectionSlice';
import validationSlice from '../application/features/validation/ValidationSlice';
import QuoteSlice from '../application/features/quote/QuoteSlice';
import PolicyholderSelectionSlice from '../application/features/policyholderSelection/PolicyholderSelectionSlice';

export const store = configureStore({
  reducer: {
    quote: QuoteSlice,
    policyholderSelection: PolicyholderSelectionSlice,
    searchInsured: SearchInsuredSlice,
    modalitySelecion: ModalitySlice,
    validation: validationSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import FlowSlice from '../application/features/flow/FlowSlice';
import SearchInsuredSlice from '../application/features/searchInsured/SearchInsuredSlice';
import ModalitySlice from '../application/features/modalitySelection/ModalitySelectionSlice';
import validationSlice from '../application/features/validation/ValidationSlice';
import QuoteSlice from '../application/features/quote/QuoteSlice';
import PolicyholderSelectionSlice from '../application/features/policyholderSelection/PolicyholderSelectionSlice';

export const store = configureStore({
  reducer: {
    quote: QuoteSlice,
    flow: FlowSlice,
    policyholderSelection: PolicyholderSelectionSlice,
    searchInsured: SearchInsuredSlice,
    modalitySelecion: ModalitySlice,
    validation: validationSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export type RootState = ReturnType<typeof store.getState>;

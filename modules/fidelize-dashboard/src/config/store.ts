import { configureStore } from '@reduxjs/toolkit';
import ModalitySelectionSlice from '../application/features/modalitySelection/ModalitySelectionSlice';

export const store = configureStore({
  reducer: {
    modalitySelection: ModalitySelectionSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

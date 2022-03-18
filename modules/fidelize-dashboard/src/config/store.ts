import { configureStore } from '@reduxjs/toolkit';
import ModalitySelectionSlice from '../application/features/modalitySelection/ModalitySelectionSlice';
import OpportunitiesDetailsSlice from '../application/features/opportunitiesDetails/OpportunitiesDetailsSlice';

export const store = configureStore({
  reducer: {
    modalitySelection: ModalitySelectionSlice,
    opportunityDetails: OpportunitiesDetailsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

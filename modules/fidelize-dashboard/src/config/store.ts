import { configureStore } from '@reduxjs/toolkit';
import ModalitySelectionSlice from '../application/features/modalitySelection/ModalitySelectionSlice';
import OpportunitiesDetailsSlice from '../application/features/opportunitiesDetails/OpportunitiesDetailsSlice';
import PolicyholderFilterSlice from '../application/features/policyholderFilter/PolicyholderFilterSlice';

export const store = configureStore({
  reducer: {
    modalitySelection: ModalitySelectionSlice,
    opportunityDetails: OpportunitiesDetailsSlice,
    policyholderFilter: PolicyholderFilterSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

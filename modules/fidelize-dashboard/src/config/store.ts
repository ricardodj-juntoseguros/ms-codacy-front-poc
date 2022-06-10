import { configureStore } from '@reduxjs/toolkit';
import ModalitySelectionSlice from '../application/features/modalitySelection/ModalitySelectionSlice';
import OpportunitiesDetailsSlice from '../application/features/opportunitiesDetails/OpportunitiesDetailsSlice';
import PolicyholderFilterSlice from '../application/features/policyholderFilter/PolicyholderFilterSlice';
import AccessCheckSlice from '../application/features/accessCheck/AccessCheckSlice';
import SummaryChartsSlice from '../application/features/summaryCharts/SummaryChartsSlice';
import SummarySlice from '../application/features/summary/SummarySlice';

export const store = configureStore({
  reducer: {
    modalitySelection: ModalitySelectionSlice,
    opportunityDetails: OpportunitiesDetailsSlice,
    policyholderFilter: PolicyholderFilterSlice,
    accessCheck: AccessCheckSlice,
    summary: SummarySlice,
    summaryCharts: SummaryChartsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

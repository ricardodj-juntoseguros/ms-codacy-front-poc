import { configureStore } from '@reduxjs/toolkit';
import ModalitySelectionSlice from '../application/features/modalitySelection/ModalitySelectionSlice';
import OpportunitiesDetailsSlice from '../application/features/opportunitiesDetails/OpportunitiesDetailsSlice';
import PolicyholderFilterSlice from '../application/features/policyholderFilter/PolicyholderFilterSlice';
import AccessCheckSlice from '../application/features/accessCheck/AccessCheckSlice';
import SummaryChartsSlice from '../application/features/summaryCharts/SummaryChartsSlice';
import SummarySlice from '../application/features/summary/SummarySlice';
import ViewAllPolicyholdersInWalletSlice from '../application/features/viewAllPolicyholdersInWallet/ViewAllPolicyholdersInWalletSlice';
import SummariesQuantitativeSlice from '../application/features/summariesQuantitative/SummariesQuantitativeSlice';

export const store = configureStore({
  reducer: {
    modalitySelection: ModalitySelectionSlice,
    opportunityDetails: OpportunitiesDetailsSlice,
    policyholderFilter: PolicyholderFilterSlice,
    allPolicyholdersInWalletFilter: ViewAllPolicyholdersInWalletSlice,
    accessCheck: AccessCheckSlice,
    summary: SummarySlice,
    summaryCharts: SummaryChartsSlice,
    summariesQuantitative: SummariesQuantitativeSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

import { configureStore } from '@reduxjs/toolkit';
import FlowSlice from '../application/features/flow/FlowSlice';
import ProposalSlice from '../application/features/proposal/ProposalSlice';
import InsuredAndPolicyholderSelectionSlice from '../application/features/insuredAndPolicyholderSelection/InsuredAndPolicyholderSelectionSlice';
import ProjectSelectionSlice from '../application/features/projectSelection/ProjectSelectionSlice';
import ValidationSlice from '../application/features/validation/ValidationSlice';
import ModalitySelectionSlice from '../application/features/ModalitySelection/ModalitySelectionSlice';

export const store = configureStore({
  reducer: {
    flow: FlowSlice,
    proposal: ProposalSlice,
    insuredAndPolicyholderSelection: InsuredAndPolicyholderSelectionSlice,
    projectSelection: ProjectSelectionSlice,
    validation: ValidationSlice,
    modalitySelection: ModalitySelectionSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

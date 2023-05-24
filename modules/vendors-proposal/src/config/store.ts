import { configureStore } from '@reduxjs/toolkit';
import FlowSlice from '../application/features/flow/FlowSlice';
import ProposalSlice from '../application/features/proposal/ProposalSlice';
import ProjectSelectionSlice from '../application/features/projectSelection/ProjectSelectionSlice';

export const store = configureStore({
  reducer: {
    flow: FlowSlice,
    proposal: ProposalSlice,
    projectSelection: ProjectSelectionSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

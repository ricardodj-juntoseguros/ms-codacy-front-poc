import { configureStore } from '@reduxjs/toolkit';
import FlowSlice from '../application/features/flow/FlowSlice';
import ProposalSlice from '../application/features/proposal/ProposalSlice';

export const store = configureStore({
  reducer: {
    flow: FlowSlice,
    proposal: ProposalSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

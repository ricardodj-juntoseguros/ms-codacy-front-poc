import { configureStore } from '@reduxjs/toolkit';
import FlowSlice from '../application/features/flow/FlowSlice';

export const store = configureStore({
  reducer: {
    flow: FlowSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

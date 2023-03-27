import { configureStore } from '@reduxjs/toolkit';
import MappingRequestsListSlice from '../application/features/mappingRequestsList/MappingRequestsListSlice';

export const store = configureStore({
  reducer: {
    mappingRequestsList: MappingRequestsListSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

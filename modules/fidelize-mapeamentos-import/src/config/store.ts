import { configureStore } from '@reduxjs/toolkit';
import MappingRequestsListSlice from '../application/features/mappingRequestsList/MappingRequestsListSlice';
import ModalMappingSlice from '../application/features/modalMapping/ModalMappingSlice';

export const store = configureStore({
  reducer: {
    mappingRequestsList: MappingRequestsListSlice,
    modalMapping: ModalMappingSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

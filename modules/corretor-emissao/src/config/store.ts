import { configureStore } from '@reduxjs/toolkit';
import CorretorEmissaoReducer from '../application/features/createCorretorEmissao/CorretorEmissaoSlice';

export const store = configureStore({
  reducer: {
    corretorEmissao: CorretorEmissaoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

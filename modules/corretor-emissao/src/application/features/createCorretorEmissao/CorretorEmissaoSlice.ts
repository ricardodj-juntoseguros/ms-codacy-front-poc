import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../config/store';
import CorretorEmissao from '../../types/model/CorretorEmissaoModel';
import { create as createCorretorEmissao } from './CorretorEmissaoApi';

const initialState: CorretorEmissao = {
  corretorEmissao: null,
  isLoading: false,
  error: null,
};

export const postCorretorEmissao = createAsyncThunk(
  'corretorEmissao/postCorretorEmissao',
  async (corretorEmissao: CorretorEmissao, thunkAPI) => {
    const response = await createCorretorEmissao(corretorEmissao);
    return response.data;
  },
);

export const corretorEmissaoSlice = createSlice({
  name: 'corretorEmissao',
  initialState,
  reducers: {
    create: (state, action: PayloadAction<CorretorEmissao>) => {
      state.corretorEmissao = action.payload;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(postCorretorEmissao.pending, (state: CorretorEmissao) => {
        state.isLoading = true;
      })
      .addCase(
        postCorretorEmissao.fulfilled,
        (state: CorretorEmissao, action: PayloadAction<CorretorEmissao>) => {
          state.isLoading = false;
          state.corretorEmissao = action.payload;
          state.error = null;
        },
      )
      .addCase(
        postCorretorEmissao.rejected,
        (state: CorretorEmissao, action) => {
          state.corretorEmissao = null;
          state.isLoading = false;
          state.error = action.error.message;
        },
      );
  },
});

export const { create } = corretorEmissaoSlice.actions;

export const selectCorretorEmissao = (state: RootState) =>
  state.corretorEmissao;

export default corretorEmissaoSlice.reducer;

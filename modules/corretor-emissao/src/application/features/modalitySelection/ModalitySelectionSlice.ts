import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../config/store';
import { ModalitySelectionModel } from '../../types/model';
import ModalityApi from './ModalitySelecionApi';

const initialState: ModalitySelectionModel = {
  modalityOptions: [],
  loadingGetModalities: false,
};

export const getModalityByPolicyHolder = createAsyncThunk(
  'modalitySearch/getModalityByPolicyHolder',
  async (id: number) => {
    const response = await ModalityApi.getModalitiesByPolicyholder(id);

    return response;
  },
);

export const ModalitySelectionSlice = createSlice({
  name: 'modalitySearch',
  initialState,
  reducers: {
    resetSearch: state => {
      state.modalityOptions = [];
      state.loadingGetModalities = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getModalityByPolicyHolder.fulfilled, (state, action) => {
        state.modalityOptions = action.payload;
        state.loadingGetModalities = false;
      })
      .addCase(getModalityByPolicyHolder.pending, state => {
        state.loadingGetModalities = true;
      })
      .addCase(getModalityByPolicyHolder.rejected, state => {
        state.loadingGetModalities = false;
      });
  },
});

export const selectModality = (state: RootState) => state.modalitySelecion;

export const { actions: modalitySearchActions } = ModalitySelectionSlice;

export default ModalitySelectionSlice.reducer;

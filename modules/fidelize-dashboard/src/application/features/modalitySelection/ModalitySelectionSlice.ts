import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../config/store';
import { ModalitySelectionModel, ModalityEnum } from '../../types/model';

const initialState: ModalitySelectionModel = {
  selectedModality: ModalityEnum.LABOR,
};

export const modalitySelectionSlice = createSlice({
  name: 'modalitySelection',
  initialState,
  reducers: {
    setSelectedModality: (state, action: PayloadAction<ModalityEnum>) => {
      state.selectedModality = action.payload;
    },
  },
});

export const selectModality = (state: RootState) => state.modalitySelection;

export const { actions: modalitySelectionSliceActions } =
  modalitySelectionSlice;

export default modalitySelectionSlice.reducer;

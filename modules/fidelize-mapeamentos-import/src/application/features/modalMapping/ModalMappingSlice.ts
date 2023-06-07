import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'modules/fidelize-mapeamentos-import/src/config/store';
import { ModalMappingModel } from '../../types/model/ModalMappingModel';

const initialState: ModalMappingModel = {
  editorId: 0,
  scrollingTo: 0,
};

const modalMappingSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setEditorId: (state, action: PayloadAction<number[]>) => {
      state.editorId = action.payload[0] || 0;
      state.scrollingTo = action.payload[1] || 0;
    },
  },
});

export const selectModalEdition = (state: RootState) => state.modalMapping;

export const { setEditorId } = modalMappingSlice.actions;
export default modalMappingSlice.reducer;

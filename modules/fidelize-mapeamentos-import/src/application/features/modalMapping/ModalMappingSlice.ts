import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../config/store';
import { ModalMappingModel } from '../../types/model/ModalMappingModel';

const initialState: ModalMappingModel = {
  editorId: 0,
  scrollingTo: 0,
};

const modalMappingSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setEditorId: (state, { payload }) => {
      state.editorId = payload.edit || 0;
      state.scrollingTo = payload.scroll || 0;
    },
  },
});

export const selectModalEdition = (state: RootState) => state.modalMapping;

export const { setEditorId } = modalMappingSlice.actions;
export default modalMappingSlice.reducer;

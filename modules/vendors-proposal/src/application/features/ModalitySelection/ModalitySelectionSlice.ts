import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { makeToast } from 'junto-design-system';
import { RootState } from '../../../config/store';
import { ModalitySelectionModel } from '../../types/model';
import { ModalityDTO } from '../../types/dto';
import ModalitySelectionAPI from './ModalitySelectionAPI';

export const fetchModalities = createAsyncThunk<
  ModalityDTO[],
  string,
  { rejectValue: string }
>(
  'modalitySelection/fetchModalities',
  async (federalId: string, { rejectWithValue }) => {
    return ModalitySelectionAPI.getModalities(federalId)
      .then(response => response)
      .catch(error => rejectWithValue(error.data.data.message));
  },
);

const initialState: ModalitySelectionModel = {
  modalityOptions: [],
  modalityOptionsMapped: [],
  modalityOptionsLoading: false,
};

export const ModalitySelectionSlice = createSlice({
  name: 'ModalitySelection',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchModalities.pending, state => {
        state.modalityOptionsLoading = true;
      })
      .addCase(fetchModalities.fulfilled, (state, action) => {
        state.modalityOptions = action.payload;

        state.modalityOptionsMapped = action.payload.map(modality => ({
          ...modality,
          label: modality.externalDescription,
          value: modality.modalityId.toString(),
        }));

        state.modalityOptionsLoading = false;
      })
      .addCase(fetchModalities.rejected, (state, action) => {
        state.modalityOptionsLoading = false;
        if (action.payload) makeToast('error', action.payload);
      });
  },
});

export const selectModalitySelection = (state: RootState) =>
  state.modalitySelection;

export const { actions: modalitySelectionActions } = ModalitySelectionSlice;

export default ModalitySelectionSlice.reducer;

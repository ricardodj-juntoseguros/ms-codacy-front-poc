import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { makeToast } from 'junto-design-system';
import handleError from '../../../helpers/handlerError';
import { RootState } from '../../../config/store';
import { ModalityModel, ModalitySelectionModel } from '../../types/model';
import ModalityApi from './ModalitySelecionApi';

const initialState: ModalitySelectionModel = {
  modalityOptions: [],
  loadingModalities: false,
};

interface FetchModalitiesParam {
  brokerFederalId: string;
  policyholderFederalId: string;
}

export const fetchModalities = createAsyncThunk<
  ModalityModel[],
  FetchModalitiesParam,
  { rejectValue: string }
>('modalitySelection/fetchModalities', async (params, { rejectWithValue }) => {
  const { brokerFederalId, policyholderFederalId } = params;
  return ModalityApi.fetchModalities(brokerFederalId, policyholderFederalId)
    .then(response => {
      return response.map(modality => ({
        ...modality,
        value: modality.id.toString(),
        label: modality.description,
      }));
    })
    .catch(error => {
      return rejectWithValue(handleError(error));
    });
});

export const ModalitySelectionSlice = createSlice({
  name: 'modalitySearch',
  initialState,
  reducers: {
    resetModalitySelection: state => {
      state.modalityOptions = [];
      state.loadingModalities = false;
    },
    setModalityOptions: (state, action: PayloadAction<ModalityModel[]>) => {
      state.modalityOptions = action.payload;
      state.loadingModalities = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchModalities.fulfilled, (state, action) => {
        state.modalityOptions = action.payload;
        state.loadingModalities = false;
      })
      .addCase(fetchModalities.pending, state => {
        state.loadingModalities = true;
      })
      .addCase(fetchModalities.rejected, (state, action) => {
        state.loadingModalities = false;
        const message = action.payload
          ? action.payload
          : 'Erro ao buscar modalidades';
        makeToast('error', message);
      });
  },
});

export const selectModality = (state: RootState) => state.modalitySelecion;

export const { actions: modalitySelectionActions } = ModalitySelectionSlice;

export default ModalitySelectionSlice.reducer;

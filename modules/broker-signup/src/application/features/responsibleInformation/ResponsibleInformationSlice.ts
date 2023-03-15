import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../config/store';
import { ResponsibleInformationModel } from '../../types/model';

const initialState: ResponsibleInformationModel = {
  name: '',
  cpf: '',
  phone: '',
  email: '',
};

export const responsibleInformationSlice = createSlice({
  name: 'responsibleInformationSlice',
  initialState,
  reducers: {
    resetResponsibleInformationSlice: () => initialState,
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setCpf: (state, action: PayloadAction<string>) => {
      state.cpf = action.payload;
    },
    setPhone: (state, action: PayloadAction<string>) => {
      state.phone = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
  },
});

export const selectResponsibleInformation = (state: RootState) => state.responsibleInformation;

export const { actions:responsibleInformationSliceActions } =
responsibleInformationSlice;

export default responsibleInformationSlice.reducer;

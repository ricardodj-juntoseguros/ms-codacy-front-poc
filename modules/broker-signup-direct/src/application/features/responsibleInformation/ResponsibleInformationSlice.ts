import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../config/store';
import { ResponsibleInformationModel } from '../../types/model';

const initialState: ResponsibleInformationModel = {
  nameResponsable: '',
  cpfResponsable: '',
  phoneNumberResponsable: '',
  emailBroker: '',
  termsResponsibility: false,
  emailHasValidated: false,
};

export const responsibleInformationSlice = createSlice({
  name: 'responsibleInformationSlice',
  initialState,
  reducers: {
    resetResponsibleInformationSlice: () => initialState,
    setName: (state, action: PayloadAction<string>) => {
      state.nameResponsable = action.payload;
    },
    setCpf: (state, action: PayloadAction<string>) => {
      state.cpfResponsable = action.payload;
    },
    setPhone: (state, action: PayloadAction<string>) => {
      state.phoneNumberResponsable = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.emailBroker = action.payload;
    },
    setTermsResponsibility: (state, action: PayloadAction<boolean>) => {
      state.termsResponsibility = action.payload;
    },
    setEmailHasValidated: (state, action: PayloadAction<boolean>) => {
      state.emailHasValidated = action.payload;
    },
  },
});

export const selectResponsibleInformation = (state: RootState) =>
  state.responsibleInformation;

export const { actions: responsibleInformationSliceActions } =
  responsibleInformationSlice;

export default responsibleInformationSlice.reducer;

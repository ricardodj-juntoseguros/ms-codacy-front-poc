import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../config/store';
import { BrokerInformationModel, RegisterBrokerTypeEnum } from '../../types/model';

const initialState: BrokerInformationModel = {
  status: RegisterBrokerTypeEnum.NO_REGISTRY,
  description: '',
  information: {
      federalId: '',
      parentCompany: '',
      corporateName: '',
      fantasyName: '',
      situation: '',
      dateSituation: '',
      reasonSituation: '',
      cityNameForeign: '',
      countryCod: '',
      countryName: '',
      codNatJuridica: '',
      dateStart: '',
      cnaeFiscal: '',
      addressType: '',
      address: '',
      number: '',
      complement: '',
      neighbourhood: '',
      cep: '',
      uf: '',
      municipalityCod: '',
      municipality: '',
      ddd1: '',
      phone1: '',
      ddd2: '',
      phone2: '',
      dddfax: '',
      numberFax: '',
      email: '',
      qualifResp: '',
      shareCapital:'',
      size: '',
      opcSimple: '',
      dateOpcSimple: '',
      dateExcSimple: '',
      opcMei: '',
      specialSituation: '',
      dateSpecialSituation: ''
  }
};

export const brokerInformationSlice = createSlice({
  name: 'brokerInformationSlice',
  initialState,
  reducers: {
    resetBrokerInformation: () => initialState,
    setBrokerInformationModel: (state, action: PayloadAction<BrokerInformationModel>) => {
      state.status = action.payload.status;
      state.description = action.payload.description;
      state.information = action.payload.information;
    },
    setFederalId: (state, action: PayloadAction<string>) => {
      state.information.federalId = action.payload;
    },
  },
});

export const selectBroker= (state: RootState) => state.brokerInformation;

export const { actions: brokerInformationSliceActions } =
brokerInformationSlice;

export default brokerInformationSlice.reducer;

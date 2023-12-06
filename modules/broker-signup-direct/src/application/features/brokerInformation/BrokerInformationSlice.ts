import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../config/store';
import {
  BrokerInformationModel,
  RegisterBrokerTypeEnum,
} from '../../types/model';
import { BankDTO } from '../../types/dto';

const initialState: BrokerInformationModel = {
  pathUpdate: '',
  status: RegisterBrokerTypeEnum.NO_REGISTRY,
  description: '',
  information: {
    federalId: '',
    brokerCompanyName: '',
    address: '',
    number: '',
    complement: '',
    zipCode: '',
    bairro: '',
    city: '',
    state: '',
    email: '',
  },
  bankDetails: {
    name: '',
    bankCode: '',
    accounNumber: '',
    bankNumber: '',
    bankDigit: '',
    accounDigit: '',
  },
  susepCode: '',
  iss: 0,
  simplesOptant: false,
  susepSituation: false,
  renewRegistration: false,
  hasProductDamageInsurance: false,
  codeIsValid: false,
  brokerExternalId: 0,
  brokerUserName: '',
  signupDirect: false,
  showIss: true,
  bankIsValid: false,
};

export const brokerInformationSlice = createSlice({
  name: 'brokerInformationSlice',
  initialState,
  reducers: {
    resetBrokerInformation: () => initialState,
    setBrokerInformationModel: (
      state,
      action: PayloadAction<BrokerInformationModel>,
    ) => {
      state.status = action.payload.status;
      state.description = action.payload.description;
      state.information = action.payload.information;
      state.susepCode = action.payload.susepCode;
      state.renewRegistration = action.payload.renewRegistration;
      state.hasProductDamageInsurance =
        action.payload.hasProductDamageInsurance;
      state.susepSituation = action.payload.susepSituation;
      state.simplesOptant = action.payload.simplesOptant;
    },
    setpathUpdate: (state, action: PayloadAction<string>) => {
      state.pathUpdate = action.payload;
    },
    setFederalId: (state, action: PayloadAction<string>) => {
      state.information.federalId = action.payload;
    },
    setBank: (state, action: PayloadAction<BankDTO>) => {
      state.bankDetails.name = action.payload.name;
      state.bankDetails.bankCode = action.payload.bankCode;
    },
    setBankName: (state, action: PayloadAction<string>) => {
      state.bankDetails.name = action.payload;
    },
    setAccounNumber: (state, action: PayloadAction<string>) => {
      state.bankDetails.accounNumber = action.payload;
    },
    setBankNumber: (state, action: PayloadAction<string>) => {
      state.bankDetails.bankNumber = action.payload;
    },
    setBankDigit: (state, action: PayloadAction<string>) => {
      state.bankDetails.bankDigit = action.payload;
    },
    setAccounDigit: (state, action: PayloadAction<string>) => {
      state.bankDetails.accounDigit = action.payload;
    },
    setCodSusep: (state, action: PayloadAction<string>) => {
      state.susepCode = action.payload;
    },
    setIss: (state, action: PayloadAction<number>) => {
      state.iss = action.payload;
    },
    setSimplesOptant: (state, action: PayloadAction<boolean>) => {
      state.simplesOptant = action.payload;
    },
    setCodeIsValid: (state, action: PayloadAction<boolean>) => {
      state.codeIsValid = action.payload;
    },
    setBrokerExternalId: (state, action: PayloadAction<number>) => {
      state.brokerExternalId = action.payload;
    },
    setBrokerUserName: (state, action: PayloadAction<string>) => {
      state.brokerUserName = action.payload;
    },
    setSignupDirect: (state, action: PayloadAction<boolean>) => {
      state.signupDirect = action.payload;
    },
    setShowIss: (state, action: PayloadAction<boolean>) => {
      state.showIss = action.payload;
    },
    setbankIsValid: (state, action: PayloadAction<boolean>) => {
      state.bankIsValid = action.payload;
    },
  },
});

export const selectBroker = (state: RootState) => state.brokerInformation;

export const { actions: brokerInformationSliceActions } =
  brokerInformationSlice;

export default brokerInformationSlice.reducer;

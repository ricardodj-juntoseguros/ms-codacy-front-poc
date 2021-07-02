import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../config/store';
import {
  PolicyholderModel,
  ModalityModel,
  SubsidiaryModel,
  QuoteModel,
  InsuredModel,
  AddressModel,
  InstallmentModel,
  ContractDataModel,
  PricingModel,
  TimeframeAndCoverageModel,
} from '../../types/model';
import {
  generateQuote,
  generateQuoteFulFilled,
  generateQuotePending,
  generateQuoteRejected,
} from './thunks/GenerateQuoteThunk';

const initialState: QuoteModel = {
  policyholder: null,
  modality: null,
  subsidiary: null,
  timeframeAndCoverage: {} as TimeframeAndCoverageModel,
  contractData: {} as ContractDataModel,
  pricing: {
    maxRate: 11.99,
    feeStandard: 11.85,
  } as PricingModel,
  installments: [],
  loadingQuote: false,
};

export const quoteSlice = createSlice({
  name: 'quote',
  initialState,
  reducers: {
    setPolicyholder: (
      state,
      action: PayloadAction<PolicyholderModel | null>,
    ) => {
      state.policyholder = action.payload;
      state.modality = null;
      state.subsidiary = null;
    },
    setModality: (state, action: PayloadAction<ModalityModel | null>) => {
      state.modality = action.payload;
    },
    setSubsidiary: (state, action: PayloadAction<SubsidiaryModel | null>) => {
      state.subsidiary = action.payload;
    },
    setTimeframeStart: (state, action: PayloadAction<string>) => {
      state.timeframeAndCoverage.timeframeStart = action.payload;
    },
    setTimeframeEnd: (state, action: PayloadAction<string>) => {
      state.timeframeAndCoverage.timeframeEnd = action.payload;
    },
    setDurationInDays: (state, action: PayloadAction<number>) => {
      state.timeframeAndCoverage.durationInDays = action.payload;
    },
    setCoverage: (state, action: PayloadAction<number>) => {
      state.timeframeAndCoverage.coverageValue = action.payload;
    },
    setStandardRate: (state, action: PayloadAction<number>) => {
      state.pricing.feeStandard = action.payload;
    },
    setContractInsured: (state, action: PayloadAction<InsuredModel>) => {
      state.contractData.insured = action.payload;
    },
    setContractInsuredAddress: (state, action: PayloadAction<AddressModel>) => {
      state.contractData.address = action.payload;
    },
    setContractInstallment: (
      state,
      action: PayloadAction<InstallmentModel>,
    ) => {
      state.contractData.installment = action.payload;
    },
    setContractNumber: (state, action: PayloadAction<string>) => {
      state.contractData.contractNumber = action.payload;
    },
    setContractAttachmentNotice: (state, action: PayloadAction<string>) => {
      state.contractData.attachmentNotice = action.payload;
    },
    setContractFirstInstallment: (state, action: PayloadAction<string>) => {
      state.contractData.firstInstallment = action.payload;
    },
    setContractPolicyInProgress: (state, action: PayloadAction<boolean>) => {
      state.contractData.policyInProgress = action.payload;
    },
    setContractContacts: (state, action: PayloadAction<string[]>) => {
      state.contractData.contacts = action.payload;
    },
    setContractComments: (state, action: PayloadAction<string>) => {
      state.contractData.comments = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(generateQuote.pending, generateQuotePending)
      .addCase(generateQuote.fulfilled, generateQuoteFulFilled)
      .addCase(generateQuote.rejected, generateQuoteRejected);
  },
});

export const selectQuote = (state: RootState) => state.quote;

export const { actions: quoteSliceActions } = quoteSlice;

export default quoteSlice.reducer;

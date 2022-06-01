import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
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
  CoverageDataModel,
} from '../../types/model';
import { LimitModel } from '../../types/model/LimitModel';
import { parseDateToString } from '../../../helpers/parseDateToString';
import QuoteApi from './QuoteApi';
import { QuoteDTO } from '../../types/dto';

export const generateQuote = createAsyncThunk(
  'quote/generateQuote',
  async (quoteData: QuoteDTO, { rejectWithValue }) => {
    return QuoteApi.generateQuote(quoteData)
      .then(response => response)
      .catch(error => rejectWithValue(error.data));
  },
);

const initialState: QuoteModel = {
  policyholder: null,
  modality: null,
  submodality: null,
  subsidiary: null,
  policyholderLimit: {
    limiteDisponivel: 0,
    mensagemLimiteFlexibilizacao: '',
    mensagemLabelLimite: '',
    exibirLimiteFlexibilizacao: false,
    valorLimiteFlexibilizacao: 0,
  } as LimitModel,
  coverageData: {
    startDate: parseDateToString(new Date()),
    endDate: '',
    durationInDays: 0,
    securedAmount: 0,
  } as CoverageDataModel,
  contractData: {} as ContractDataModel,
  identification: null,
  installments: [],
  pricing: {} as PricingModel,
  loadingQuote: false,
  hasQuoteChanges: false,
};

export const quoteSlice = createSlice({
  name: 'quote',
  initialState,
  reducers: {
    resetQuote: () => initialState,
    setPolicyholder: (state, action: PayloadAction<PolicyholderModel>) => {
      state.policyholder = action.payload;
    },
    setModality: (state, action: PayloadAction<ModalityModel>) => {
      state.modality = action.payload;
      state.hasQuoteChanges = true;
    },
    setSubsidiary: (state, action: PayloadAction<SubsidiaryModel>) => {
      state.subsidiary = action.payload;
      state.hasQuoteChanges = true;
    },
    setPolicyholderLimit: (state, action: PayloadAction<LimitModel>) => {
      state.policyholderLimit = action.payload;
      state.hasQuoteChanges = true;
    },
    setStartDate: (state, action: PayloadAction<string>) => {
      state.coverageData.startDate = action.payload;
      state.hasQuoteChanges = true;
    },
    setEndDate: (state, action: PayloadAction<string>) => {
      state.coverageData.endDate = action.payload;
      state.hasQuoteChanges = true;
    },
    setDurationInDays: (state, action: PayloadAction<number>) => {
      state.coverageData.durationInDays = action.payload;
      state.hasQuoteChanges = true;
    },
    setSecuredAmount: (state, action: PayloadAction<number>) => {
      state.coverageData.securedAmount = action.payload;
      state.hasQuoteChanges = true;
    },
    setProposalFee: (state, action: PayloadAction<number>) => {
      state.pricing.proposalFee = action.payload;
      state.hasQuoteChanges = true;
    },
    setFeeFlex: (state, action: PayloadAction<number>) => {
      state.pricing.feeFlex = action.payload;
      state.hasQuoteChanges = true;
    },
    setCommissionFlex: (state, action: PayloadAction<number>) => {
      state.pricing.commissionFlex = action.payload;
      state.hasQuoteChanges = true;
    },
    setContractInsured: (state, action: PayloadAction<InsuredModel>) => {
      state.contractData.insured = action.payload;
      state.hasQuoteChanges = true;
    },
    setContractInsuredAddress: (state, action: PayloadAction<AddressModel>) => {
      state.contractData.address = action.payload;
      state.hasQuoteChanges = true;
    },
    setContractInstallment: (
      state,
      action: PayloadAction<InstallmentModel>,
    ) => {
      state.contractData.installment = action.payload;
      state.hasQuoteChanges = true;
    },
    setContractNumber: (state, action: PayloadAction<string>) => {
      state.contractData.contractNumber = action.payload;
      state.hasQuoteChanges = true;
    },
    setContractAttachmentNotice: (state, action: PayloadAction<string>) => {
      state.contractData.attachmentNotice = action.payload;
      state.hasQuoteChanges = true;
    },
    setContractFirstInstallment: (state, action: PayloadAction<string>) => {
      state.contractData.firstInstallment = action.payload;
      state.hasQuoteChanges = true;
    },
    setContractPolicyInProgress: (state, action: PayloadAction<boolean>) => {
      state.contractData.policyInProgress = action.payload;
      state.hasQuoteChanges = true;
    },
    setContractContacts: (state, action: PayloadAction<string[]>) => {
      state.contractData.contacts = action.payload;
      state.hasQuoteChanges = true;
    },
    setContractComments: (state, action: PayloadAction<string>) => {
      state.contractData.comments = action.payload;
      state.hasQuoteChanges = true;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(generateQuote.pending, state => {
        state.loadingQuote = true;
      })
      .addCase(generateQuote.fulfilled, (state, action) => {
        const feeFlex = action.payload.quote.feeFlex
          ? action.payload.quote.feeFlex
          : action.payload.quote.proposalFee;
        const proposalFee = action.payload.quote.feeFlex
          ? action.payload.pricing.feeStandard
          : action.payload.quote.proposalFee;
        const comssionFlexValue = action.payload.pricing.commissionFlex
          ? action.payload.pricing.commissionFlex
          : action.payload.pricing.comissionValue;

        const pricingPayload = {
          ...action.payload.pricing,
          feeFlex: feeFlex || 0,
          totalPrize: action.payload.quote.totalPrize,
          proposalFee: proposalFee || 0,
          commissionFlex: comssionFlexValue || 0,
        };

        state.pricing = pricingPayload;
        state.identification = action.payload.quote.identification;
        state.installments = action.payload.pricing.installmentOptions;
        state.loadingQuote = false;
        state.hasQuoteChanges = false;
      })
      .addCase(generateQuote.rejected, state => {
        state.loadingQuote = false;
        state.hasQuoteChanges = false;
      });
  },
});

export const selectQuote = (state: RootState) => state.quote;

export const { actions: quoteSliceActions } = quoteSlice;

export default quoteSlice.reducer;

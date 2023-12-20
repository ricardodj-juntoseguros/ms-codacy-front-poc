import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { makeToast } from 'junto-design-system';
import {
  addDays,
  differenceInCalendarDays,
  format,
  startOfDay,
} from 'date-fns';
import { DEFAULT_SUBMODALITY_ID } from '../../../constants';
import { RootState } from '../../../config/store';
import {
  PolicyholderModel,
  ModalityModel,
  QuoteModel,
} from '../../types/model';
import QuoteApi from './QuoteApi';
import {
  ProposalResumeDTO,
  QuotationDTO,
  QuoteResultDTO,
  SubmodalityDTO,
} from '../../types/dto';
import { parseStringToDate } from '../../../helpers';
import { PolicyholderAffiliatesModel } from '../../types/model/PolicyholderAffiliatesModel';

export const postQuotation = createAsyncThunk<
  QuoteResultDTO,
  QuotationDTO,
  { rejectValue: string }
>(
  'quote/postQuotation',
  async (quoteData: QuotationDTO, { rejectWithValue }) => {
    return QuoteApi.postQuotation(quoteData)
      .then(response => response)
      .catch(error => rejectWithValue(error.data));
  },
);

export const putQuotation = createAsyncThunk<
  QuoteResultDTO,
  { proposalId: number; quoteData: QuotationDTO },
  { rejectValue: string }
>(
  'quote/putQuotation',
  async ({ proposalId, quoteData }, { rejectWithValue }) => {
    return QuoteApi.putQuotation(proposalId, quoteData)
      .then(response => response)
      .catch(error => rejectWithValue(error.data));
  },
);

const initialState: QuoteModel = {
  currentQuote: null,
  policyholder: null,
  policyholderAffiliate: null,
  modality: null,
  submodality: null,
  startDateValidity: format(startOfDay(new Date()), 'dd/MM/yyyy'),
  endDateValidity: null,
  durationInDays: NaN,
  securedAmount: NaN,
  toggleRateFlex: false,
  proposalFee: NaN,
  feeFlex: NaN,
  commissionFlex: NaN,
  paymentType: 0,
  additionalCoverage: [],
  hasAdditionalCoverageLabor: false,
  hasAdditionalCoverageGuarantee: false,
  hasAdditionalCoverageVigilance: false,
  loadingQuote: false,
  hasQuoteChanges: false,
  isQuoteResume: false,
};

export const quoteSlice = createSlice({
  name: 'quote',
  initialState,
  reducers: {
    resetQuote: () => initialState,
    setQuoteResumeData: (state, action: PayloadAction<ProposalResumeDTO>) => {
      const {
        securedAmount,
        proposalFee,
        commissionFlex,
        feeFlex,
        durationInDays,
      } = action.payload;
      state.isQuoteResume = true;
      state.securedAmount = securedAmount;
      state.proposalFee = proposalFee;
      state.commissionFlex = commissionFlex;
      state.feeFlex = feeFlex;
      state.durationInDays = durationInDays;
    },
    setPolicyholder: (state, action: PayloadAction<PolicyholderModel>) => {
      state.policyholder = action.payload;
      state.hasQuoteChanges = true;
    },
    setPolicyholderAffiliate: (
      state,
      action: PayloadAction<PolicyholderAffiliatesModel>,
    ) => {
      state.policyholderAffiliate = action.payload;
      state.hasQuoteChanges = true;
    },
    setModality: (state, action: PayloadAction<ModalityModel>) => {
      state.modality = action.payload;
      state.submodality =
        action.payload.submodalities.find(
          modality => modality.id === DEFAULT_SUBMODALITY_ID,
        ) || null;
      state.hasQuoteChanges = true;
    },
    setStartDateValidity: (state, action: PayloadAction<string | null>) => {
      state.startDateValidity = action.payload;
      if (action.payload !== null && state.endDateValidity) {
        const diff = differenceInCalendarDays(
          parseStringToDate(state.endDateValidity),
          parseStringToDate(action.payload),
        );
        state.durationInDays = diff > 0 ? diff : null;
      } else {
        state.durationInDays = null;
      }
      state.toggleRateFlex = false;
      state.feeFlex = null;
      state.commissionFlex = null;
      state.hasQuoteChanges = true;
    },
    setEndDateValidity: (state, action: PayloadAction<string | null>) => {
      state.endDateValidity = action.payload;
      if (action.payload !== null && state.startDateValidity) {
        const diff = differenceInCalendarDays(
          parseStringToDate(action.payload),
          parseStringToDate(state.startDateValidity),
        );
        state.durationInDays = diff > 0 ? diff : null;
      } else {
        state.durationInDays = null;
      }
      state.toggleRateFlex = false;
      state.feeFlex = null;
      state.commissionFlex = null;
      state.hasQuoteChanges = true;
    },
    setDurationInDays: (state, action: PayloadAction<number>) => {
      if (Number.isNaN(action.payload)) {
        state.durationInDays = null;
        return;
      }
      state.durationInDays = action.payload;
      if (state.startDateValidity) {
        state.endDateValidity = format(
          addDays(parseStringToDate(state.startDateValidity), action.payload),
          'dd/MM/yyyy',
        );
      }
      state.toggleRateFlex = false;
      state.feeFlex = null;
      state.commissionFlex = null;
      state.hasQuoteChanges = true;
    },
    setSecuredAmount: (state, action: PayloadAction<number>) => {
      state.securedAmount = action.payload;
      state.toggleRateFlex = false;
      state.feeFlex = null;
      state.commissionFlex = null;
      state.hasQuoteChanges = true;
    },
    setProposalFee: (state, action: PayloadAction<number>) => {
      state.proposalFee = action.payload;
      state.toggleRateFlex = false;
      state.feeFlex = null;
      state.commissionFlex = null;
      state.hasQuoteChanges = true;
    },
    setToggleRateFlex: state => {
      if (!state.currentQuote) return;
      const valueToSet = !state.toggleRateFlex;
      const { commissionFlex, feeFlex } = state;
      state.toggleRateFlex = valueToSet;
      if (!valueToSet && (!!commissionFlex || !!feeFlex)) {
        state.hasQuoteChanges = true;
      }
    },
    setFeeFlex: (state, action: PayloadAction<number>) => {
      state.feeFlex = action.payload;
      state.hasQuoteChanges = true;
    },
    setCommissionFlex: (state, action: PayloadAction<number>) => {
      state.commissionFlex = action.payload;
      state.hasQuoteChanges = true;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(postQuotation.pending, state => {
        state.loadingQuote = true;
      })
      .addCase(putQuotation.pending, state => {
        state.loadingQuote = true;
      })
      .addCase(postQuotation.fulfilled, (state, action) => {
        state.currentQuote = action.payload;
        state.proposalFee = action.payload.proposalFee;
        state.feeFlex = action.payload.pricing.feeFlex || NaN;
        state.commissionFlex = action.payload.pricing.commissionFlex || NaN;
        state.loadingQuote = false;
        state.hasQuoteChanges = false;
      })
      .addCase(putQuotation.fulfilled, (state, action) => {
        state.currentQuote = action.payload;
        state.proposalFee = action.payload.proposalFee;
        state.feeFlex = action.payload.pricing.feeFlex || NaN;
        state.commissionFlex = action.payload.pricing.commissionFlex || NaN;
        state.loadingQuote = false;
        state.hasQuoteChanges = false;
      })
      .addCase(postQuotation.rejected, state => {
        state.loadingQuote = false;
        state.hasQuoteChanges = true;
        makeToast('error', 'Ocorreu um erro ao gerar a cotação');
      })
      .addCase(putQuotation.rejected, state => {
        state.loadingQuote = false;
        state.hasQuoteChanges = true;
        makeToast('error', 'Ocorreu um erro ao atualizar os dados da cotação');
      });
  },
});

export const selectQuote = (state: RootState) => state.quote;

export const { actions: quoteSliceActions } = quoteSlice;

export default quoteSlice.reducer;

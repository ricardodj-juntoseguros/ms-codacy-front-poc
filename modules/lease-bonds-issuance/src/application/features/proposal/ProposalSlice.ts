import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { makeToast } from 'junto-design-system';
import brLocale from 'date-fns/locale/pt-BR';
import { format, parse, startOfDay } from 'date-fns';
import { RootState } from '../../../config/store';
import handleError from '../../../helpers/handlerError';
import { ProposalModel } from '../../types/model/ProposalModel';
import {
  CanAuthorizeDTO,
  ProposalDTO,
  ProposalResultDTO,
} from '../../types/dto';
import ProposalApi from './ProposalApi';
import CanAuthorizeApi from '../canAuthorize/CanAuthorizeApi';

export const putProposal = createAsyncThunk<
  ProposalResultDTO,
  { proposalId: number; proposalData: ProposalDTO },
  { rejectValue: string }
>(
  'proposal/putProposal',
  async ({ proposalId, proposalData }, { rejectWithValue }) => {
    return ProposalApi.putProposal(proposalId, proposalData)
      .then(async response => response)
      .catch(error => {
        const defaultMessage = 'Ocorreu um erro ao gerar a proposta.';
        const message = error.data
          ? handleError(error.data, defaultMessage)
          : defaultMessage;
        return rejectWithValue(message);
      });
  },
);

export const canAuthorizeProposal = createAsyncThunk<
  CanAuthorizeDTO,
  { policyId: number },
  { rejectValue: string }
>(
  'proposal/canAuthorizeProposal',
  async ({ policyId }, { rejectWithValue }) => {
    return CanAuthorizeApi.getCanAuthorize(policyId)
      .then(response => response)
      .catch(error => rejectWithValue(handleError(error)));
  },
);

const initialState: ProposalModel = {
  currentProposal: null,
  identification: null,
  createdAt: null,
  insured: null,
  insuredAddress: null,
  biddingNumber: '',
  biddingDescription: '',
  paymentType: null,
  comments: '',
  firstDueDate: '',
  numberOfInstallments: null,
  loadingProposal: false,
  createProposalSuccess: false,
  isAutomaticPolicy: true,
  hasOnlyFinancialPending: false,
  hasProposalChanges: false,
  issuedAt: '',
  protocols: [],
  loadingCanAuthorize: false,
  contacts: [],
};

export const proposaSlice = createSlice({
  name: 'proposal',
  initialState,
  reducers: {
    clearProposal: state => {
      state.identification = null;
      state.currentProposal = null;
      state.insured = null;
      state.insuredAddress = null;
      state.biddingNumber = '';
      state.biddingDescription = '';
      state.paymentType = null;
      state.comments = '';
      state.firstDueDate = '';
      state.numberOfInstallments = null;
      state.createProposalSuccess = false;
      state.isAutomaticPolicy = true;
      state.hasOnlyFinancialPending = false;
      state.hasProposalChanges = false;
      state.issuedAt = '';
      state.protocols = [];
      state.loadingCanAuthorize = false;
      state.contacts = [];
    },
    setProposalResumeData: (state, action) => {
      const {
        payload: {
          insured,
          insuredAddress,
          biddingNumber,
          biddingDescription,
          identification,
          paymentType,
          observations,
          firstDueDate,
          numberOfInstallments,
          createdAt,
        },
      } = action;
      state.insured = insured;
      state.insuredAddress = insuredAddress;
      state.biddingNumber = biddingNumber;
      state.biddingDescription = biddingDescription;
      state.identification = identification;
      state.paymentType = paymentType;
      state.comments = observations;
      state.numberOfInstallments = numberOfInstallments;
      state.createdAt = createdAt;
      state.firstDueDate = format(
        startOfDay(
          parse(firstDueDate.split('T')[0], 'yyyy-MM-dd', new Date(), {
            locale: brLocale,
          }),
        ),
        'dd/MM/yyyy',
      );
    },
    setInsured: (state, action) => {
      state.insured = action.payload;
      state.hasProposalChanges = true;
    },
    setInsuredAddress: (state, action) => {
      state.insuredAddress = action.payload;
      state.hasProposalChanges = true;
    },
    setBiddingNumber: (state, action: PayloadAction<string>) => {
      state.biddingNumber = action.payload;
      state.hasProposalChanges = true;
    },
    setBiddingDescription: (state, action: PayloadAction<string>) => {
      state.biddingDescription = action.payload;
      state.hasProposalChanges = true;
    },
    setComments: (state, action: PayloadAction<string>) => {
      state.comments = action.payload;
      state.hasProposalChanges = true;
    },
    setPaymentType: (state, action: PayloadAction<number>) => {
      if (state.paymentType === action.payload) return;
      state.paymentType = action.payload;
      state.hasProposalChanges = true;
    },
    setFirstDueDate: (state, action: PayloadAction<string | null>) => {
      if (state.firstDueDate === action.payload) return;
      state.firstDueDate = action.payload;
      state.hasProposalChanges = true;
    },
    setNumberOfInstallments: (state, action: PayloadAction<number>) => {
      if (state.numberOfInstallments === action.payload) return;
      state.numberOfInstallments = action.payload;
      state.hasProposalChanges = true;
    },
    setCreateProposalSuccess: (state, action) => {
      state.createProposalSuccess = action.payload;
    },
    setIsAutomaticPolicy: (state, action) => {
      state.isAutomaticPolicy = action.payload;
    },
    setHasOnlyFinancialPending: (state, action) => {
      state.hasOnlyFinancialPending = action.payload;
    },
    setLoadingProposal: (state, action) => {
      state.loadingProposal = action.payload;
    },
    setHasProposalChanges: (state, action) => {
      state.hasProposalChanges = action.payload;
    },
    setCurrentProposal: (state, action) => {
      state.currentProposal = action.payload;
    },
    setIssuedAt: (state, action) => {
      state.issuedAt = action.payload;
    },
    setProtocols: (state, action) => {
      state.protocols = action.payload;
    },
    setContacts: (state, action: PayloadAction<string[]>) => {
      state.contacts = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(putProposal.pending, state => {
        state.loadingProposal = true;
        state.createProposalSuccess = false;
      })
      .addCase(putProposal.fulfilled, (state, action) => {
        const {
          payload: { createdAt, PolicyId },
        } = action;
        state.identification = {
          PolicyId,
        };
        state.createdAt = createdAt;
        state.loadingProposal = false;
        state.createProposalSuccess = true;
        state.hasProposalChanges = false;
      })
      .addCase(putProposal.rejected, (state, action) => {
        state.loadingProposal = false;
        state.createProposalSuccess = false;
        state.hasProposalChanges = true;
        state.currentProposal = null;
        if (action.payload) makeToast('error', action.payload);
      })
      .addCase(canAuthorizeProposal.pending, state => {
        state.loadingCanAuthorize = true;
      })
      .addCase(canAuthorizeProposal.fulfilled, (state, action) => {
        const { isAutomaticPolicy, hasOnlyFinancialPending } = action.payload;
        state.isAutomaticPolicy = isAutomaticPolicy;
        state.hasOnlyFinancialPending = hasOnlyFinancialPending;
        state.loadingCanAuthorize = false;
      })
      .addCase(canAuthorizeProposal.rejected, (state, action) => {
        state.loadingCanAuthorize = false;
        if (action.payload) makeToast('error', action.payload);
      });
  },
});

export const selectProposal = (state: RootState) => state.proposal;

export const { actions: proposalActions } = proposaSlice;

export default proposaSlice.reducer;

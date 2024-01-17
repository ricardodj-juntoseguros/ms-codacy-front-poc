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
import CanAuthorizeApi from '../canAuthorize/CanAuthorizeApi';
import ProposalApi from './ProposalApi';

export const putProposal = createAsyncThunk<
  ProposalResultDTO & CanAuthorizeDTO,
  { proposalId: number; proposalData: ProposalDTO },
  { rejectValue: string }
>(
  'proposal/putProposal',
  async ({ proposalId, proposalData }, { rejectWithValue }) => {
    return ProposalApi.putProposal(proposalId, proposalData)
      .then(async response => {
        const canAuthorizeResponse = await CanAuthorizeApi.getCanAuthorize(
          response.PolicyId,
        );
        return { ...response, ...canAuthorizeResponse };
      })
      .catch(error => {
        const defaultMessage = 'Ocorreu um erro ao gerar a proposta.';
        const message = error.data
          ? handleError(error.data, defaultMessage)
          : defaultMessage;
        return rejectWithValue(message);
      });
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
      state.paymentType = action.payload;
      state.hasProposalChanges = true;
    },
    setFirstDueDate: (state, action: PayloadAction<string | null>) => {
      state.firstDueDate = action.payload;
      state.hasProposalChanges = true;
    },
    setNumberOfInstallments: (state, action: PayloadAction<number>) => {
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
    setHasProposalChanges: (state, action) => {
      state.hasProposalChanges = action.payload;
    },
    setCurrentProposal: (state, action) => {
      state.currentProposal = action.payload;
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
          payload: {
            createdAt,
            PolicyId,
            isAutomaticPolicy,
            hasOnlyFinancialPending,
          },
        } = action;
        state.identification = {
          PolicyId,
        };
        state.createdAt = createdAt;
        state.loadingProposal = false;
        state.hasOnlyFinancialPending = hasOnlyFinancialPending;
        state.isAutomaticPolicy = isAutomaticPolicy;
        state.createProposalSuccess = true;
        state.hasProposalChanges = false;
      })
      .addCase(putProposal.rejected, (state, action) => {
        state.loadingProposal = false;
        state.createProposalSuccess = false;
        state.hasProposalChanges = true;
        state.currentProposal = null;
        if (action.payload) makeToast('error', action.payload);
      });
  },
});

export const selectProposal = (state: RootState) => state.proposal;

export const { actions: proposalActions } = proposaSlice;

export default proposaSlice.reducer;

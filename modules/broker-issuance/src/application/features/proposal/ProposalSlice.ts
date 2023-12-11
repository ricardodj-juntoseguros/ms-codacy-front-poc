import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { makeToast } from "junto-design-system";
import { RootState } from "../../../config/store";
import handleError from "../../../helpers/handlerError";
import { ProposalModel } from "../../types/model/ProposalModel";
import { ProposalDTO, ProposalResultDTO } from "../../types/dto";
import ProposalApi from "./ProposalApi";

export const putProposal = createAsyncThunk<
  ProposalResultDTO,
  { proposalId: number; proposalData: ProposalDTO },
  { rejectValue: string }
>(
  'proposal/putProposal',
  async ({ proposalId, proposalData }, { rejectWithValue }) => {
    return ProposalApi.putProposal(proposalId, proposalData)
      .then(response => response)
      .catch(error => {
        const defaultMessage = 'Ocorreu um erro ao gerar a proposta.';
        const message = error.data ? handleError(error.data, defaultMessage) : defaultMessage;
        return rejectWithValue(message);
      });
  },
);

const initialState: ProposalModel = {
  identification: null,
  insured: null,
  insuredAddress: null,
  biddingNumber: '',
  biddingDescription: '',
  loadingProposal: false,
  createProposalSuccess: false,
};

export const proposaSlice = createSlice({
  name: 'proposal',
  initialState,
  reducers: {
    clearProposal: state => {
      state.identification = null;
      state.insured = null;
      state.insuredAddress = null;
      state.biddingNumber = '';
      state.biddingDescription = '';
      state.createProposalSuccess = false;
    },
    setInsured: (state, action) => {
      state.insured = action.payload;
    },
    setInsuredAddress: (state, action) => {
      state.insuredAddress = action.payload;
    },
    setBiddingNumber: (state, action) => {
      state.biddingNumber = action.payload;
    },
    setBiddingDescription: (state, action) => {
      state.biddingDescription = action.payload;
    },
    setCreateProposalSuccess: (state, action) => {
      state.createProposalSuccess = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(putProposal.pending, state => {
        state.loadingProposal = true;
        state.createProposalSuccess = false;
      })
      .addCase(putProposal.fulfilled, (state, action) => {
        state.identification = {
          policyId: action.payload.PolicyId,
        };
        state.loadingProposal = false;
        state.createProposalSuccess = true;
      })
      .addCase(putProposal.rejected, (state, action) => {
        state.loadingProposal = false;
        state.createProposalSuccess = false;
        if (action.payload) makeToast('error', action.payload);
      });
  },
});

export const selectProposal = (state: RootState) => state.proposal;

export const { actions: proposalActions } = proposaSlice;

export default proposaSlice.reducer;

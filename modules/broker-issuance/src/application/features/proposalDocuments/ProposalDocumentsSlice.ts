import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { makeToast } from "junto-design-system";
import { RootState } from "../../../config/store";
import { ProposalDocumentsModel } from "../../types/model";
import handleError from "../../../helpers/handlerError";
import { ProposalDocumentDTO } from "../../types/dto";
import ProposalDocumentsApi from "./ProposalDocumentsApi";

export const getProposalDocuments = createAsyncThunk<
  ProposalDocumentDTO[],
  number,
  { rejectValue: string }
>('proposalDocuments/getProposalDocuments', async (policyId, { rejectWithValue }) => {
  return ProposalDocumentsApi.getProposalDocuments(policyId)
    .then(response => response)
    .catch(error => rejectWithValue(handleError(error.data)));
});

const initialState: ProposalDocumentsModel = {
  proposalDocuments: [],
  loadingDocuments: false,
}

export const proposalDocumentsSlice = createSlice({
  name: 'proposalDocuments',
  initialState,
  reducers: {
    clearProposalDocuments: state => {
      state.proposalDocuments = [];
      state.loadingDocuments = false;
    },
    setDocuments: (state, action) => {
      state.proposalDocuments = action.payload;
    },
    setLoadingDocuments: (state, action) => {
      state.loadingDocuments = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getProposalDocuments.pending, state => {
        state.loadingDocuments = true;
      })
      .addCase(getProposalDocuments.fulfilled, (state, action) => {
        state.loadingDocuments = false;
        state.proposalDocuments = action.payload;
      })
      .addCase(getProposalDocuments.rejected, (state, action) => {
        state.loadingDocuments = false;
        if (action.payload) makeToast('error', action.payload);
      });
  },
});

export const selectProposalDocuments = (state: RootState) => state.proposalDocuments;

export const { actions: proposalDocumentsActions } = proposalDocumentsSlice;

export default proposalDocumentsSlice.reducer

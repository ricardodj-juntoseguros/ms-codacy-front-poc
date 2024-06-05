import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { makeToast } from 'junto-design-system';
import { RootState } from '../../../config/store';
import { ProposalDocumentsModel } from '../../types/model';
import handleError from '../../../helpers/handlerError';
import { InternalizeDocumentsDTO, ProposalDocumentDTO } from '../../types/dto';
import ProposalDocumentsApi from './ProposalDocumentsApi';

export const getProposalDocuments = createAsyncThunk<
  ProposalDocumentDTO[],
  number,
  { rejectValue: string }
>(
  'proposalDocuments/getProposalDocuments',
  async (policyId, { rejectWithValue }) => {
    return ProposalDocumentsApi.getProposalDocuments(policyId)
      .then(response => response)
      .catch(error => rejectWithValue(handleError(error.data)));
  },
);

export const getInternalizeDocumentList = createAsyncThunk<
  InternalizeDocumentsDTO[],
  number,
  { rejectValue: string }
>(
  'proposalDocuments/getInternalizeDocumentList',
  async (modalityId, { rejectWithValue }) => {
    return ProposalDocumentsApi.getDocumentsToInternalize(modalityId)
      .then(response => response)
      .catch(error => rejectWithValue(handleError(error.data)));
  },
);

const initialState: ProposalDocumentsModel = {
  proposalDocuments: [],
  loadingDocuments: false,
  loadingInternalizeDocumentsList: false,
  internalizeDocumentsList: [],
};

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
        state.proposalDocuments = action.payload.map(document => ({
          name: document.filename,
          url: document.url,
          size: document.size,
        }));
      })
      .addCase(getProposalDocuments.rejected, (state, action) => {
        state.loadingDocuments = false;
        if (action.payload) makeToast('error', action.payload);
      })
      .addCase(getInternalizeDocumentList.pending, state => {
        state.loadingInternalizeDocumentsList = true;
      })
      .addCase(getInternalizeDocumentList.fulfilled, (state, action) => {
        state.loadingInternalizeDocumentsList = false;
        state.internalizeDocumentsList = action.payload.map(
          ({ documentId, description }) => ({
            documentId,
            description,
          }),
        );
      })
      .addCase(getInternalizeDocumentList.rejected, (state, action) => {
        state.loadingInternalizeDocumentsList = false;
        if (action.payload) makeToast('error', action.payload);
      });
  },
});

export const selectProposalDocuments = (state: RootState) =>
  state.proposalDocuments;

export const { actions: proposalDocumentsActions } = proposalDocumentsSlice;

export default proposalDocumentsSlice.reducer;

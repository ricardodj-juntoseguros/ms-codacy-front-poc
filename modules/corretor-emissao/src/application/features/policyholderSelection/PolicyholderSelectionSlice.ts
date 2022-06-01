import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'modules/corretor-emissao/src/config/store';
import {
  PolicyholderSearchModel,
  SubsidiaryModel,
  PolicyholderSelectionModel,
} from '../../types/model';

import PolicyholderSelectionApi from './PolicyholderSelectionApi';

export const searchPolicyholder = createAsyncThunk(
  'policyholderSelection/searchPolicyholder',
  async (policyholderLabel: string, { rejectWithValue }) => {
    return PolicyholderSelectionApi.searchPolicyHolder(policyholderLabel)
      .then(response => {
        const data: PolicyholderSearchModel[] = response.records.map(item => ({
          id: item.id,
          federalId: item.federalId,
          companyName: item.name,
        }));

        return data;
      })
      .catch(error => rejectWithValue(error.data));
  },
);

export const getSubsidiaryByPolicyHolderId = createAsyncThunk(
  'policyholderSelection/getSubsidiaryByPolicyHolderId',
  async (policyholderId: number, { rejectWithValue }) => {
    return PolicyholderSelectionApi.getSubsidiaryByPolicyHolder(policyholderId)
      .then(response => {
        const data: SubsidiaryModel[] = response.map(item => ({
          ...item,
          label: `${item.city} - ${item.state} - ${item.federalId}`,
        }));

        return data;
      })
      .catch(error => rejectWithValue(error.data));
  },
);

const initialState: PolicyholderSelectionModel = {
  policyholderOptions: [],
  loadingSearchPolicyholder: false,
  subsidiaryOptions: [],
  loadingDetails: false,
  loadingGetSubsidiaries: false,
};

export const policyholderSelectionSlice = createSlice({
  name: 'policyholderSelection',
  initialState,
  reducers: {
    clearPolicyholderSelection: state => {
      state.policyholderOptions = [];
      state.loadingSearchPolicyholder = false;
      state.subsidiaryOptions = [];
      state.loadingDetails = false;
      state.loadingGetSubsidiaries = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(searchPolicyholder.pending, state => {
        state.loadingSearchPolicyholder = true;
      })
      .addCase(searchPolicyholder.fulfilled, (state, action) => {
        state.loadingSearchPolicyholder = false;
        state.policyholderOptions = action.payload;
      })
      .addCase(searchPolicyholder.rejected, state => {
        state.loadingSearchPolicyholder = false;
      })
      .addCase(getSubsidiaryByPolicyHolderId.pending, state => {
        state.loadingGetSubsidiaries = true;
      })
      .addCase(getSubsidiaryByPolicyHolderId.fulfilled, (state, action) => {
        state.loadingGetSubsidiaries = false;
        state.subsidiaryOptions = action.payload;
      })
      .addCase(getSubsidiaryByPolicyHolderId.rejected, state => {
        state.loadingGetSubsidiaries = false;
      });
  },
});

export const selectPolicyholder = (state: RootState) =>
  state.policyholderSelection;

export const { actions: policyholderSelectionActions } =
  policyholderSelectionSlice;

export default policyholderSelectionSlice.reducer;

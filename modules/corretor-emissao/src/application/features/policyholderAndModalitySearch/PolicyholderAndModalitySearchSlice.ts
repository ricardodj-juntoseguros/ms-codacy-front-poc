import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../config/store';
import { PolicyholderAndModalitySearchModel } from '../../types/model';
import {
  searchPolicyHolder,
  searchPolicyHolderPending,
  searchPolicyHolderFulFilled,
  searchPolicyHolderRejected,
} from './thunks/SearchPolicyholderThunk';
import {
  getModalityByPolicyHolder,
  getModalityByPolicyholderPending,
  getModalityByPolicyholderFulFilled,
  getModalityByPolicyholderRejected,
} from './thunks/GetModalityByPolicyholderThunk';
import {
  getSubsidiaryByPolicyHolder,
  getSubsidiaryByPolicyHolderPending,
  getSubsidiaryByPolicyholderFulFilled,
  getSubsidiaryByPolicyHolderRejected,
} from './thunks/GetSubsidiaryByPolicyholderThunk';

const initialState: PolicyholderAndModalitySearchModel = {
  policyholderOptions: [],
  loadingSearchPolicyholder: false,
  modalityOptions: [],
  loadingGetModalities: false,
  subsidiaryOptions: [],
  loadingDetails: false,
  loadingGetSubsidiaries: false,
};

export const policyholderAndModalitySearchSlice = createSlice({
  name: 'policyholderAndModalitySearch',
  initialState,
  reducers: {
    resetSearch: state => {
      state.policyholderOptions = [];
      state.loadingSearchPolicyholder = false;
      state.modalityOptions = [];
      state.loadingGetModalities = false;
      state.subsidiaryOptions = [];
      state.loadingDetails = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(searchPolicyHolder.pending, searchPolicyHolderPending)
      .addCase(searchPolicyHolder.fulfilled, searchPolicyHolderFulFilled)
      .addCase(searchPolicyHolder.rejected, searchPolicyHolderRejected)
      .addCase(
        getModalityByPolicyHolder.pending,
        getModalityByPolicyholderPending,
      )
      .addCase(
        getModalityByPolicyHolder.fulfilled,
        getModalityByPolicyholderFulFilled,
      )
      .addCase(
        getModalityByPolicyHolder.rejected,
        getModalityByPolicyholderRejected,
      )
      .addCase(
        getSubsidiaryByPolicyHolder.pending,
        getSubsidiaryByPolicyHolderPending,
      )
      .addCase(
        getSubsidiaryByPolicyHolder.fulfilled,
        getSubsidiaryByPolicyholderFulFilled,
      )
      .addCase(
        getSubsidiaryByPolicyHolder.rejected,
        getSubsidiaryByPolicyHolderRejected,
      );
  },
});

export const selectPolicyholderAndModalitySearch = (state: RootState) =>
  state.policyholderAndModalitySearch;

export const { actions: policyholderAndModalitySearchSliceActions } =
  policyholderAndModalitySearchSlice;

export default policyholderAndModalitySearchSlice.reducer;

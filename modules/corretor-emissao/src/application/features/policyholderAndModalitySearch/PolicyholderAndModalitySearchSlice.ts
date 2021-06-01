import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../config/store';
import {
  PolicyholderAndModalitySearchModel,
  PolicyholderModel,
  ModalityModel,
  SubsidiaryModel,
} from '../../types/model';
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
  getSubsidiaryByPolicyholderFulFilled,
} from './thunks/GetSubsidiaryByPolicyholderThunk';

const initialState: PolicyholderAndModalitySearchModel = {
  policyholderOptions: [],
  loadingSearchPolicyholder: false,
  policyholder: null,
  modalityOptions: [],
  loadingGetModalities: false,
  subsidiaryOptions: [],
  subsidiary: null,
  modality: null,
  loadingDetails: false,
};

export const policyholderAndModalitySearchSlice = createSlice({
  name: 'policyholderAndModalitySearch',
  initialState,
  reducers: {
    resetSearch: state => {
      state.policyholderOptions = [];
      state.loadingSearchPolicyholder = false;
      state.policyholder = null;
      state.modalityOptions = [];
      state.loadingGetModalities = false;
      state.subsidiaryOptions = [];
      state.subsidiary = null;
      state.modality = null;
      state.loadingDetails = false;
    },
    setPolicyholder: (
      state,
      action: PayloadAction<PolicyholderModel | null>,
    ) => {
      state.policyholder = action.payload;
    },
    setModality: (state, action: PayloadAction<ModalityModel | null>) => {
      state.modality = action.payload;
    },
    setSubsidiary: (state, action: PayloadAction<SubsidiaryModel | null>) => {
      state.subsidiary = action.payload;
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
        getSubsidiaryByPolicyHolder.fulfilled,
        getSubsidiaryByPolicyholderFulFilled,
      );
  },
});

export const selectPolicyholderAndModalitySearch = (state: RootState) =>
  state.policyholderAndModalitySearch;

export const { resetSearch, setPolicyholder, setModality, setSubsidiary } =
  policyholderAndModalitySearchSlice.actions;

export default policyholderAndModalitySearchSlice.reducer;

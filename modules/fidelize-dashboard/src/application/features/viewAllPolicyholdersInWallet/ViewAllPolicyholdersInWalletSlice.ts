import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../config/store';
import { AllPolicyholdersInWalletFilterModel } from '../../types/model';
import viewAllPolicyholdersInWalletApi from './ViewAllPolicyholdersInWalletApi';

const initialState: AllPolicyholdersInWalletFilterModel = {
  mappedAllPolicyholdersInWallet: null,
  errorFetchAllPolicyholdersInWallet: false,
  allPolicyholdersInWalletSelection: [],
};

export const fetchAllMappedPolicyholdersInWallet = createAsyncThunk(
  '',
  async () => {
    const response =
      await viewAllPolicyholdersInWalletApi.getAllPolicyholdersInWallet();
    return response;
  },
);

export const ViewAllPolicyholdersInWalletSlice = createSlice({
  name: 'allPolicyholdersInWalletFilter',
  initialState,
  reducers: {
    setPolicyholderSelection: (
      state,
      action: PayloadAction<{ selection: string[] }>,
    ) => {
      const { selection } = action.payload;
      state.allPolicyholdersInWalletSelection = selection;
    },
    setErrorFetchPolicyholders: (state, action: PayloadAction<boolean>) => {
      state.errorFetchAllPolicyholdersInWallet = action.payload;
    },
  },
  extraReducers: builder =>
    builder
      .addCase(
        fetchAllMappedPolicyholdersInWallet.fulfilled,
        (state, action) => {
          const { payload } = action;
          state.mappedAllPolicyholdersInWallet = payload;
          state.errorFetchAllPolicyholdersInWallet = false;
        },
      )
      .addCase(fetchAllMappedPolicyholdersInWallet.rejected, state => {
        state.mappedAllPolicyholdersInWallet = [];
        state.errorFetchAllPolicyholdersInWallet = true;
      }),
});

export const selectAllPolicyholdersSelection = (state: RootState) =>
  state.allPolicyholdersInWalletFilter.allPolicyholdersInWalletSelection;

export const selectAllMappedPolicyholders = (state: RootState) =>
  state.allPolicyholdersInWalletFilter.mappedAllPolicyholdersInWallet;

export const selectAllErrorFetchPolicyholders = (state: RootState) =>
  state.allPolicyholdersInWalletFilter.errorFetchAllPolicyholdersInWallet;

export const { actions: allPolicyholdersInWalletFilterActions } =
  ViewAllPolicyholdersInWalletSlice;

export default ViewAllPolicyholdersInWalletSlice.reducer;

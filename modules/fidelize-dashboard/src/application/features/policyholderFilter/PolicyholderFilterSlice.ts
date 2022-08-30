import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../config/store';
import { PolicyholderFilterModel } from '../../types/model';
import PolicyholderFilterApi from './PolicyholderFilterApi';

const initialState: PolicyholderFilterModel = {
  mappedPolicyholders: null,
  errorFetchPolicyholders: false,
  policyholderSelection: [],
};

export const fetchMappedPolicyholders = createAsyncThunk(
  'policyholderFilter/fetchMappedPolicyholders',
  async () => {
    const response = await PolicyholderFilterApi.getMappedPolicyholderList();
    return response;
  },
);

export const policyholderFilterSlice = createSlice({
  name: 'policyholderFilter',
  initialState,
  reducers: {
    setPolicyholderSelection: (
      state,
      action: PayloadAction<{ selection: string[] }>,
    ) => {
      const { selection } = action.payload;
      state.policyholderSelection = selection;
    },
    setErrorFetchPolicyholders: (state, action: PayloadAction<boolean>) => {
      state.errorFetchPolicyholders = action.payload;
    },
  },
  extraReducers: builder =>
    builder
      .addCase(fetchMappedPolicyholders.fulfilled, (state, action) => {
        const { payload } = action;
        state.mappedPolicyholders = payload;
        state.errorFetchPolicyholders = false;
      })
      .addCase(fetchMappedPolicyholders.rejected, state => {
        state.mappedPolicyholders = [];
        state.errorFetchPolicyholders = true;
      }),
});

export const selectPolicyholderSelection = (state: RootState) =>
  state.policyholderFilter.policyholderSelection;

export const selectMappedPolicyholders = (state: RootState) =>
  state.policyholderFilter.mappedPolicyholders;

export const selectErrorFetchPolicyholders = (state: RootState) =>
  state.policyholderFilter.errorFetchPolicyholders;

export const { actions: policyholderFilterActions } = policyholderFilterSlice;

export default policyholderFilterSlice.reducer;

import { createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  PolicyholderAndModalitySearchModel,
  PolicyholderModel,
} from '../../../types/model';
import PolicyholderAndModalitySearchApi from '../PolicyholderAndModalitySearchApi';

export const searchPolicyHolder = createAsyncThunk(
  'policyholderAndModalitySearch/searchPolicyHolder',
  async (policyHolderLabel: string) => {
    const response = await PolicyholderAndModalitySearchApi.searchPolicyHolder(
      policyHolderLabel,
    );

    const data: PolicyholderModel[] = response.map(item => ({
      id: item.id,
      federalId: item.federalId,
      companyName: item.name,
    }));

    return data;
  },
);

export function searchPolicyHolderPending(
  state: PolicyholderAndModalitySearchModel,
) {
  state.loadingSearchPolicyholder = true;
}

export function searchPolicyHolderFulFilled(
  state: PolicyholderAndModalitySearchModel,
  payload: PayloadAction<PolicyholderModel[]>,
) {
  state.loadingSearchPolicyholder = false;
  state.policyholderOptions = payload.payload;
}

export function searchPolicyHolderRejected(
  state: PolicyholderAndModalitySearchModel,
) {
  state.loadingSearchPolicyholder = false;
}

import { createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  ModalityModel,
  PolicyholderAndModalitySearchModel,
} from '../../../types/model';
import PolicyholderAndModalitySearchApi from '../PolicyholderAndModalitySearchApi';

export const getModalityByPolicyHolder = createAsyncThunk(
  'policyholderAndModalitySearch/getModalityByPolicyHolder',
  async (federalId: string) => {
    const response =
      await PolicyholderAndModalitySearchApi.getModalitiesByPolicyholder(
        federalId,
      );

    const data: ModalityModel[] = response.map(item => ({
      id: item.id,
      description: item.description,
    }));

    return data;
  },
);

export function getModalityByPolicyholderPending(
  state: PolicyholderAndModalitySearchModel,
) {
  state.loadingGetModalities = true;
}

export function getModalityByPolicyholderFulFilled(
  state: PolicyholderAndModalitySearchModel,
  payload: PayloadAction<ModalityModel[]>,
) {
  state.modalityOptions = payload.payload;
  state.loadingGetModalities = false;
}

export function getModalityByPolicyholderRejected(
  state: PolicyholderAndModalitySearchModel,
) {
  state.loadingGetModalities = false;
}

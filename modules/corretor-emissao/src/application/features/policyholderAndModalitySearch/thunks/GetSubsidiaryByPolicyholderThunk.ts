import { createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  SubsidiaryModel,
  PolicyholderAndModalitySearchModel,
} from '../../../types/model';
import PolicyholderAndModalitySearchApi from '../PolicyholderAndModalitySearchApi';

export const getSubsidiaryByPolicyHolder = createAsyncThunk(
  'policyholderAndModalitySearch/getSubsidiaryByPolicyHolder',
  async (federalId: string) => {
    const response =
      await PolicyholderAndModalitySearchApi.getSubsidiaryByPolicyHolder(
        federalId,
      );

    const data: SubsidiaryModel[] = response.data.map(item => ({
      ...item,
    }));

    return data;
  },
);

export function getSubsidiaryByPolicyholderFulFilled(
  state: PolicyholderAndModalitySearchModel,
  payload: PayloadAction<SubsidiaryModel[]>,
) {
  state.subsidiaryOptions = payload.payload;
}

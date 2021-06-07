import { createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  SubsidiaryModel,
  PolicyholderAndModalitySearchModel,
} from '../../../types/model';
import PolicyholderAndModalitySearchApi from '../PolicyholderAndModalitySearchApi';

export const getSubsidiaryByPolicyHolder = createAsyncThunk(
  'policyholderAndModalitySearch/getSubsidiaryByPolicyHolder',
  async (id: number) => {
    const response =
      await PolicyholderAndModalitySearchApi.getSubsidiaryByPolicyHolder(id);

    const data: SubsidiaryModel[] = response.data.map(item => ({
      id: item.id,
      label: item.name,
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

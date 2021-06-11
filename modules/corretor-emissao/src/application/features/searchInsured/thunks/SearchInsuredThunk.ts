import { createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AddressDTO } from '../../../types/dto/AddressDTO';
import { SearchInsuredModel } from '../../../types/model';
import { InsuredModel } from '../../../types/model/InsuredModel';
import SearchInsuredApi from '../SearchInsuredApi';

export const searchInsured = createAsyncThunk(
  'contractData/searchInsured',
  async (insuredLabel: string) => {
    const response = await SearchInsuredApi.searchInsured(insuredLabel);

    const data: InsuredModel[] = response.data.map(item => {
      return {
        id: item.id,
        externalId: item.externalId,
        name: item.name,
        federalId: item.federalId,
        hasFederalId: item.hasFederalId,
        insuredType: item.insuredType,
        insuredTypeDescription: item.insuredTypeDescription,
        addresses: formatAdresses(item.addresses),
      };
    });

    return data;
  },
);

function formatAdresses(addresses: AddressDTO[]) {
  return addresses.map(address => ({
    addressExternalId: address.externalId,
    addressId: address.addressId,
    externalId: address.externalId,
    street: address.street,
  }));
}

export function searchInsuredPending(state: SearchInsuredModel) {
  state.loading = true;
}

export function searchInsuredFulFilled(
  state: SearchInsuredModel,
  payload: PayloadAction<InsuredModel[]>,
) {
  state.loading = false;
  state.searchInsuredOptions = payload.payload;
}

export function searchInsuredRejected(state: SearchInsuredModel) {
  state.loading = false;
}

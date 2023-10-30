import { AddressDTO } from './AddressDTO';

export interface InsuredDTO {
  id: number;
  externalId: number;
  federalId: string;
  addressId: number;
  name: string;
  addresses: AddressDTO[];
  insuredType: number;
  insuredTypeDescription: string;
  hasFederalId: boolean;
}

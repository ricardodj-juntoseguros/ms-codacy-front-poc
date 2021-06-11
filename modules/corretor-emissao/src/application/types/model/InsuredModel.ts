import { AddressModel } from './AddressModel';

export interface InsuredModel {
  id: number;
  externalId: number;
  name: string;
  federalId?: string;
  hasFederalId: boolean;
  insuredType: number;
  insuredTypeDescription: string;
  addresses: AddressModel[];
}

import { InsuredAddressDTO } from './InsuredAddressDTO';

export interface InsuredType {
  id: number;
  description: string;
}

export interface InsuredDTO {
  insuredId: number;
  federalId: string;
  name: string;
  type: InsuredType;
  hasFederalId: boolean;
  pending: boolean;
  active: boolean;
  justiceId: number;
  courtId: number;
  addresses: InsuredAddressDTO[];
}

export interface InsuredSearchDTO {
  hasMore: boolean;
  records: InsuredDTO[];
  numberOfRecords: number;
  hasInsuredInactive: boolean;
}

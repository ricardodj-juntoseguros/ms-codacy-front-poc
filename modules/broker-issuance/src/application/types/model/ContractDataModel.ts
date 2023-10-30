import { AddressModel } from './AddressModel';
import { InstallmentModel } from './InstallmentModel';
import { InsuredModel } from './InsuredModel';

export interface ContractDataModel {
  insured: InsuredModel | null;
  contractNumber: string;
  attachmentNotice: string;
  address: AddressModel | null;
  installment: InstallmentModel | null;
  firstInstallment: string;
  policyInProgress: boolean;
  comments: string;
  contacts: string[];
}

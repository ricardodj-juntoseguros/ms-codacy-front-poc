import { AddressModel } from './AddressModel';
import { InstallmentModel } from './InstallmentModel';
import { InsuredModel } from './InsuredModel';

export interface ContractDataModel {
  insured: InsuredModel | null;
  contractNumber: string;
  attachmentNotice: string;
  installment: InstallmentModel;
  address: AddressModel;
  firstInstallment: string | null;
  policyInProgress: boolean;
  comments: string;
  contacts: string[];
}

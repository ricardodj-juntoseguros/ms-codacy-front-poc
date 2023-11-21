import { AllPolicyholdersInWalletDTO } from '../dto';
import { SummariesQuantitativeByPolicyholderDTO } from '../dto/SummariesQuantitativeByPolicyholderDTO';

export interface AllPolicyholdersInWalletFilterModel {
  mappedAllPolicyholdersInWallet: AllPolicyholdersInWalletDTO[] | null;
  errorFetchAllPolicyholdersInWallet: boolean;
  allPolicyholdersInWalletSelection: string[];
}

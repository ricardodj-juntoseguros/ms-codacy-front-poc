import { PolicyholderSearchModel } from './PolicyholderSearchModel';
import { SubsidiaryModel } from './SubsidiaryModel';

export interface PolicyholderSelectionModel {
  policyholderOptions: PolicyholderSearchModel[];
  loadingSearchPolicyholder: boolean;
  subsidiaryOptions: SubsidiaryModel[];
  loadingDetails: boolean;
  loadingGetSubsidiaries: boolean;
}

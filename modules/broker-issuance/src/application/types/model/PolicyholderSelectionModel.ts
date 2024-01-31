import { PolicyholderAffiliatesModel } from './PolicyholderAffiliatesModel';
import { PolicyholderSearchModel } from './PolicyholderSearchModel';

export interface PolicyholderSelectionModel {
  policyholderSearchValue: string;
  isValidFederalId: boolean;
  policyholderOptions: PolicyholderSearchModel[];
  loadingSearchPolicyholder: boolean;
  affiliatesOptions: PolicyholderAffiliatesModel[];
  loadingDetails: boolean;
  loadingGetSubsidiaries: boolean;
  currentAppointmentLetter: { filename: string; size: number } | null;
}

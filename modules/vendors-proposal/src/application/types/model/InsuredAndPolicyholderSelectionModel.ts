import { PolicyholderAffiliateDTO, PolicyholderDTO } from '../dto';

export interface InsuredAndPolicyholderSelectionModel {
  policyholderInputValue: string;
  policyholderResults: PolicyholderDTO[] | null;
  loadingPolicyholders: boolean;
  isValidFederalId: boolean;
  policyholderAffiliateResults: PolicyholderAffiliateDTO[] | null;
}

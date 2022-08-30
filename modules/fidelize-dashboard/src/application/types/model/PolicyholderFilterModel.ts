import { PolicyholderDTO } from '../dto';

export interface PolicyholderFilterModel {
  mappedPolicyholders: PolicyholderDTO[] | null;
  errorFetchPolicyholders: boolean;
  policyholderSelection: string[];
}

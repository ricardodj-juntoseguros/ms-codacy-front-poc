import { SearchOptions } from 'junto-design-system';
import { ProposalPolicyholderModel } from './ProposalPolicyholderModel';
import { PolicyholderContactModel } from './PolicyholderContactModel';

export interface ProposalModel {
  contractNumber: string;
  contractValue: number;
  insuredFederalId: string;
  insuredName: string;
  insuredAddressId: number;
  policyholder: ProposalPolicyholderModel;
  hasProject: boolean;
  project: SearchOptions | null;
  policyholderContact: PolicyholderContactModel;
}

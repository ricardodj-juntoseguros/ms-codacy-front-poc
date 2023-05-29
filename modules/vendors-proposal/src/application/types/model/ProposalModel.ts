import { SearchOptions } from 'junto-design-system';
import { PolicyholderContactModel } from './PolicyholderContactModel';

export interface ProposalModel {
  contractNumber: string;
  contractValue: number;
  hasProject: boolean;
  project: SearchOptions | null;
  policyholderContact: PolicyholderContactModel;
}

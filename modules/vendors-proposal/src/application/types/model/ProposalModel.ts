import { SearchOptions } from 'junto-design-system';
import { ProposalPolicyholderModel } from './ProposalPolicyholderModel';
import { PolicyholderContactModel } from './PolicyholderContactModel';
import { ModalityModel } from './ModalityModel';

export interface ProposalModel {
  identification: {
    proposalId: number;
    policyId: number;
    quotationId: number;
    newQuoterId: number;
  } | null;
  contractNumber: string;
  contractValue: number;
  insuredFederalId: string;
  insuredName: string;
  insuredAddressId: number;
  policyholder: ProposalPolicyholderModel;
  hasProject: boolean;
  project: SearchOptions | null;
  policyholderContact: PolicyholderContactModel;
  initialValidity: string;
  endValidity: string;
  validityInDays: number;
  warrantyPercentage: number;
  modality: ModalityModel;
  additionalCoverageLabor: boolean;
  totalValue: number;
  createProposalLoading: boolean;
  createProposalSuccess: boolean;
  createdAt: string
}

import { InsuredAddressModel } from './InsuredAddressModel';
import { InsuredModel } from './InsuredModel';

export interface ProposalModel {
  identification: {
    PolicyId: number;
  } | null;
  createdAt: string | null;
  insured: InsuredModel | null;
  insuredAddress: InsuredAddressModel | null;
  biddingNumber: string;
  biddingDescription: string;
  loadingProposal: boolean;
  createProposalSuccess: boolean;
  hasProposalChanges: boolean;
}

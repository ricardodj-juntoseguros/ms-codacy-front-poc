import { InsuredAddressModel } from "./InsuredAddressModel";
import { InsuredModel } from "./InsuredModel";

export interface ProposalModel {
  identification: {
    policyId?: number;
  } | null;
  insured: InsuredModel | null;
  insuredAddress: InsuredAddressModel | null;
  biddingNumber: string;
  biddingDescription: string;
  loadingProposal: boolean;
  createProposalSuccess: boolean;

}

import { SearchOptions } from "junto-design-system";
import { InsuredAddressModel } from "./InsuredAddressModel";
import { InsuredModel } from "./InsuredModel";
import { ProposalDTO } from "../dto";

export interface ProposalModel {
  identification: {
    PolicyId: number;
  } | null;
  createdAt: string | null;
  insured: InsuredModel | null;
  insuredAddress: InsuredAddressModel | null;
  biddingNumber: string;
  biddingDescription: string;
  comments?: string;
  paymentType: SearchOptions | null;
  firstDueDate: string;
  numberOfInstallments: SearchOptions | null;
  loadingProposal: boolean;
  createProposalSuccess: boolean;
  isAutomaticPolicy: boolean;
  hasOnlyFinancialPending: boolean;
  hasProposalChanges: boolean;
  currentProposal: ProposalDTO | null;
  issuedAt: string;
}

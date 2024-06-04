import { InsuredAddressModel } from './InsuredAddressModel';
import { InsuredModel } from './InsuredModel';
import { SubmitToApprovalOrIssuanceResultDTO, ProposalDTO } from '../dto';

export interface ProposalModel {
  identification: {
    PolicyId: number;
  } | null;
  createdAt: string | null;
  currentProposal: ProposalDTO | null;
  insured: InsuredModel | null;
  insuredAddress: InsuredAddressModel | null;
  biddingNumber: string;
  biddingDescription: string;
  comments?: string;
  paymentType: number | null;
  firstDueDate: string | null;
  numberOfInstallments: number | null;
  loadingProposal: boolean;
  createProposalSuccess: boolean;
  isAutomaticPolicy: boolean;
  hasOnlyFinancialPending: boolean;
  hasProposalChanges: boolean;
  issuedAt: string;
  protocols: SubmitToApprovalOrIssuanceResultDTO['protocols'];
  loadingCanAuthorize: boolean;
  contacts: string[];
  specialAnalysisRequired: boolean;
  specialAnalysisDescription: string;
}

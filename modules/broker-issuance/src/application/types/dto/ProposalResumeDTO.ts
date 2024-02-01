export interface ProposalResumeDTO {
  proposalId: number;
  createdAt: string;
  metadata: {
    policyid?: string | number;
    quotationid?: string | number;
    newquoterid?: string | number;
  };
  policyholderId: number;
  policyholderFederalId: string;
  policyholderAffiliateFederalId: string | null;
  modalityId: number;
  subModalityId: number;
  validityStartDate: string;
  durationInDays: number;
  securedAmount: number;
  proposalFee: number;
  feeFlex: number | null;
  commissionFlex: number | null;
  insuredId: number | null;
  insuredName: string | null;
  insuredFederalId: string | null;
  insuredAddressId: number | null;
  biddingNumber: string | null;
  biddingDescription: string | null;
  observations: string | null;
  paymentType: number | null;
  firstDueDate: string | null;
  selectedNumberOfInstallments: number;
}

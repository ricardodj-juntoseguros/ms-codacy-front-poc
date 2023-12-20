export interface ProposalResumeDTO {
  proposalId: number;
  metadata: {
    policyid?: string | number;
    quotationid?: string | number;
    newquoterid?: string | number;
  };
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
}

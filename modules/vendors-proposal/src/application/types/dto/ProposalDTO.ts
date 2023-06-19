export interface ProposalDTO {
  policyholderFederalId: string;
  policyholderAffiliateFederalId?: string | undefined;
  biddingNumber: string;
  insuredFederalId: string;
  insuredAddressId: number;
  modalityId: number;
  subModalityId: number;
  validityStartDate: string;
  validityDurationInDays: number;
  securedAmount: number;
  additionalLaborCoverage: boolean;
  contacts: string[];
}

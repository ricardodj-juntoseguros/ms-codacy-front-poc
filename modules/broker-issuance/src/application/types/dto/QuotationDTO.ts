export interface QuotationDTO {
  policyholder: {
    federalId?: string;
    affiliateFederalId?: string | null;
  };
  modality: {
    id?: number;
    subModalityId?: number;
  };
  validity: {
    startDate?: string;
    durationInDays?: number | null;
  };
  pricing?: {
    proposalFee: number | null;
    commissionFlex?: number | null;
    feeFlex?: number | null;
  };
  securedAmount?: number;
  numberOfInstallments?: number;
  additionalLaborCoverage: boolean;
  brokerFederalId?: string;
}

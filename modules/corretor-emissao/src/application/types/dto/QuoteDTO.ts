export interface QuoteDTO {
  policyHolder: {
    federalId: string;
    affiliateFederalId: string;
  };
  modality: {
    id: number;
    subModalityId: number;
  };
  validity: {
    startDate: string;
    durationInDays: number;
  };
  securedAmount: number;
  commissionFlex: number | null;
  feeFlex: number | null;
  proposalFee: number | null;
  numberOfInstallments?: number;
  originSystemId: number;
  documentType: number;
  additionalCoverage: {
    labor: boolean;
    vigilance: boolean;
    guarantee: boolean;
  };
}

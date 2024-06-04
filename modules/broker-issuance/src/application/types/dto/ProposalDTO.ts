export interface ProposalDTO {
  insured: {
    id: number;
    federalId: string | null;
    addressId: number;
  };
  selectedInstallmentOptions: {
    numberOfInstallments: number;
    paymentType: number;
    firstDueDate: string;
  };
  brokerFederalId: string;
  biddingNumber: string;
  biddingDescription?: string | null;
  contacts?: string[] | null;
  observations?: string | null;
  specialAnalysis: {
    required: boolean;
    description: string;
  };
}

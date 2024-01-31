export interface ProposalDTO {
  insured: {
    id: number;
    federalId: string;
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
}

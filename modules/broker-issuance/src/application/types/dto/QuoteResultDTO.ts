export interface QuoteResultDTO {
  identification: {
    ProposalId: number;
    QuotationId: number;
    NewQuoterId: number;
  };
  totalPrize: number;
  proposalFee: number;
  pricing: {
    fee: number;
    feeStandard: number;
    comissionValue: number;
    commissionFee: number;
    hasFeeFlex: boolean;
    hasCommissionFlex: boolean;
    commissionFlex: number | null;
    feeFlex: number | null;
  };
  installmentOptions: {
    numberOfInstallments: number;
    firstDueDate: string;
    installments: [
      {
        number: number;
        dueDate: string;
        mainValue: number;
        iof: number;
        policyCost: number;
        installmentValue: number;
        fractionationValue: number;
      },
    ];
  }[];
}

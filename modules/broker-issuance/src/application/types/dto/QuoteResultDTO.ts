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
    feeFlexEnabled: boolean;
    feeFlexMaxValue?: number | null;
    feeFlex?: number | null;
    commissionFlexEnabled: boolean;
    commissionFlexMaxValue?: number | null;
    commissionFlex?: number | null;
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

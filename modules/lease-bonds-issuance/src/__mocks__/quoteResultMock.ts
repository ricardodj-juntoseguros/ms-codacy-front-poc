import { QuoteResultDTO } from '../application/types/dto';

export const quoteResultMock = {
  identification: {
    ProposalId: 90408,
    QuotationId: 1868859,
    NewQuoterId: 1397190,
  },
  totalPrize: 190,
  proposalFee: 0.26,
  pricing: {
    fee: 0.26,
    feeStandard: 0.26,
    comissionValue: 38,
    commissionFee: 20,
    commissionFlexEnabled: true,
    commissionFlexMaxValue: 100,
    commissionFlex: null,
    feeFlexEnabled: false,
    feeFlex: null,
    feeFlexMaxValue: null,
  },
  installmentOptions: [
    {
      numberOfInstallments: 1,
      firstDueDate: new Date().toISOString(),
      totalPrize: 190,
      installments: [
        {
          number: 1,
          dueDate: new Date().toISOString(),
          mainValue: 190,
          iof: 0,
          policyCost: 0,
          installmentValue: 190,
          fractionationValue: 0,
        },
      ],
    },
  ],
} as QuoteResultDTO;

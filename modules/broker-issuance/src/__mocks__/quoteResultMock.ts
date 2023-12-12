import { QuoteResultDTO } from '../application/types/dto';

export const quoteResulMock = {
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
      firstDueDate: '2023-12-06T00:00:00+00:00',
      installments: [
        {
          number: 1,
          dueDate: '2023-12-06T00:00:00+00:00',
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

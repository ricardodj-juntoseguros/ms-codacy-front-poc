import { QuoteResultDTO } from '../application/types/dto';
import { parseDateToString } from '../helpers';

export const quoteResulMock = {
  quote: {
    identification: [
      {
        name: 'proposalId',
        value: 2,
      },
    ],
    policyholder: {
      federalId: '33220071000159',
      affiliateFederalId: null,
    },
    broker: {
      federalId: '77777777777777',
    },
    user: 'testcorretor_cor',
    modality: {
      id: 82,
      subModalityId: 1,
    },
    validity: {
      startDate: parseDateToString(
        new Date('Fri May 27 2022 17:52:38 GMT-0300 (GMT-03:00)'),
      ),
      durationInDays: 365,
      endDate: parseDateToString(
        new Date('Fri May 27 2023 17:52:38 GMT-0300 (GMT-03:00)'),
      ),
    },
    securedAmount: 1000,
    commissionFlex: null,
    feeFlex: null,
    proposalFee: 1.87,
    additionalCoverage: {
      labor: false,
      vigilance: false,
      guarantee: false,
    },
    numberOfInstallments: 1,
    originSystemId: 5,
    documentType: 1,
    paymentType: 1,
    totalPrize: 130,
    commissionValue: 57,
  },
  pricing: {
    netPrize: 130,
    baseDate: parseDateToString(
      new Date('Fri May 27 2022 17:52:38 GMT-0300 (GMT-03:00)'),
    ),
    fee: 1.87,
    feeStandard: 1.87,
    feeRule: 'standard',
    hasFeeFlex: false,
    hasCommissionFlex: false,
    feeFlexAggravationPercent: 1,
    commissionFee: 23,
    commissionFlex: null,
    comissionValue: 57,
    commissionRule: 'standard',
    reinsuranceRange: '',
    guarantor: false,
    guarantorFederalId: '',
    paymentType: 1,
    matchedRule: '',
    installmentOptions: [
      {
        numberOfInstallments: 1,
        installments: [
          {
            number: 1,
            dueDate: parseDateToString(
              new Date('Fri May 27 2022 17:52:38 GMT-0300 (GMT-03:00)'),
            ),
            mainValue: 130,
            iof: 0,
            policyCost: 0,
            installmentValue: 130,
            fractionationValue: 130,
          },
        ],
        totalFractionationValue: 130,
        commissionFee: 23,
        commissionValue: 57,
        commissions: [
          {
            brokerFederalId: '',
            fee: 1.87,
            value: 57,
          },
        ],
        totalPrize: 130,
        totalMainValue: 130,
        totalPolicyCost: 0,
        totalIOF: 0,
        firstDueDate: parseDateToString(
          new Date('Fri May 27 2022 17:52:38 GMT-0300 (GMT-03:00)'),
        ),
      },
    ],
    discount: 0,
    aggravations: [],
    minimumPrizeRule: 'standard',
    additionalCoverage: [],
    reinsuranceContractId: 1,
    hasAdditionalCoverageLabor: false,
    hasAdditionalCoverageGuarantee: false,
    hasAdditionalCoverageVigilance: false,
  },
} as QuoteResultDTO;

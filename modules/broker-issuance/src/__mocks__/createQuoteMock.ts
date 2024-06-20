import { QuotationDTO } from '../application/types/dto';
import { parseDateToString } from '../helpers';

export const createQuoteMock = {
  policyholder: {
    federalId: '91833813000118',
    affiliateFederalId: '',
  },
  modality: {
    id: 82,
    subModalityId: 1,
  },
  validity: {
    startDate: parseDateToString(
      new Date('Fri May 27 2022 17:52:38 GMT-0300 (GMT-03:00)'),
    ),
    durationInDays: 365,
  },
  securedAmount: 1000,
  additionalCoverage: {
    labor: true,
    rateAggravation: true,
  },
  brokerFederalId: '06465132135429',
  numberOfInstallments: 1,
  firstDueDate: null,
  renewal: {
    isPolicyInProgress: false,
    type: 0,
    mainPolicyNumber: '',
  },
} as QuotationDTO;

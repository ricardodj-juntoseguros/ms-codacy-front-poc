import { parseDateToString } from '../helpers';

export const quoteMock = {
  policyHolder: {
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
  commissionFlex: null,
  feeFlex: null,
  proposalFee: null,
  originSystemId: 5,
  documentType: 1,
  additionalCoverage: {
    labor: false,
    vigilance: false,
    guarantee: false,
  },
};

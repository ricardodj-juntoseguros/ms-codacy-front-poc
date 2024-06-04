import { ProposalResumeDTO } from '../application/types/dto';

export const proposalMock = {
  insured: {
    id: 12345,
    federalId: '29468014000116',
    addressId: 30451,
  },
  selectedInstallmentOptions: {
    numberOfInstallments: 2,
    paymentType: 0,
    firstDueDate: '2023-12-11T00:00:00+00:00',
  },
  brokerFederalId: '06465132135429',
  biddingNumber: '12345',
  biddingDescription: '98765',
  contacts: [],
  observations: 'test',
  specialAnalysis: {
    required: false,
    description: '',
  },
};

export const proposalResumeMock = {
  proposalId: 90895,
  metadata: {
    quotationid: '1870918',
    newquoterid: '1401096',
    policyid: '4276847',
  },
  policyholderId: 31832,
  policyholderFederalId: '97837181000147',
  policyholderAffiliateFederalId: '97837181002000',
  modalityId: 99,
  subModalityId: 1,
  validityStartDate: '2024-02-01T03:00:00Z',
  durationInDays: 120,
  securedAmount: 45000,
  proposalFee: 0.46,
  commissionFlex: null,
  feeFlex: null,
  insuredId: 6455,
  insuredName:
    'PREFEITURA DA CIDADE DO RIO DE JANEIRO - PROCURADORIA GERAL DO MUNICIPIO',
  insuredFederalId: '42498733000148',
  insuredAddressId: 5539,
  biddingNumber: '12324',
  biddingDescription: '40028922',
  observations: '',
  firstDueDate: '2024-01-02T00:00:00Z',
  selectedNumberOfInstallments: 1,
  isPolicyInProgress: true,
  additionalCoverage: {
    labor: false,
    rateAggravation: false,
  },
  specialAnalysis: {
    required: false,
    description: '',
  },
} as ProposalResumeDTO;

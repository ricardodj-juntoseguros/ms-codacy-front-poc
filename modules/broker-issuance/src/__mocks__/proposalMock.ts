import { ProposalResumeDTO } from '../application/types/dto';

export const proposalMock = {
  insured: {
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
  observations: 'teste',
};

export const proposalResumeMock = {
  proposalId: 90895,
  metadata: {
    quotationid: '1870918',
    newquoterid: '1401096',
  },
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
} as ProposalResumeDTO;

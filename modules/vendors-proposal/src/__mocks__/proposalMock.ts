import { format } from 'date-fns';
import { ProposalDTO } from '../application/types/dto';

export const proposalMock: ProposalDTO = {
  policyholderFederalId: '91833813000118',
  policyholderAffiliateFederalId: '',
  insuredFederalId: '91833813000118',
  biddingNumber: '12345',
  insuredAddressId: 21,
  modalityId: 97,
  subModalityId: 90,
  validityStartDate: format(new Date(), 'dd/MM/yyyy'),
  validityDurationInDays: 360,
  securedAmount: 1000,
  additionalLaborCoverage: true,
  contacts: ['john@doe.com'],
};

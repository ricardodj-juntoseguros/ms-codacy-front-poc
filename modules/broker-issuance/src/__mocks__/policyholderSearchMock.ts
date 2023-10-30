import { PolicyholderSearchDTO } from '../application/types/dto';

export const policyholderSearchMock = {
  hasMore: false,
  records: [
    {
      id: 1,
      federalId: '99999999999999',
      name: 'Test',
    },
    {
      id: 2,
      federalId: '88888888888888',
      name: 'Test 2',
    },
  ],
} as PolicyholderSearchDTO;

import { AxiosHttpClient } from '@infrastructure/http-client';
import RealStateSelectionApi from './RealStateSelectionApi';

describe('RealStateSelectionApi', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_LEASE_BONDS_BFF_URL = 'any_url';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getRealStateDetails should call bff service correctly', async () => {
    const mockData = {
      hasMore: false,
      records: [
        {
          id: 1,
          name: 'test',
          federalId: '99999999999999',
        },
      ],
    };

    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return mockData;
      });

    const result = await RealStateSelectionApi.getRealStateDetails('test');

    expect(mockGet).toHaveBeenCalledWith({
      url: '/v1/real-state',
      params: { q: 'test' },
    });
    expect(result).toBe(mockData);
  });
});

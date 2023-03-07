import { AxiosHttpClient } from '@infrastructure/http-client';
import SearchBrokerApi from './SearchBrokerApi';

describe('SearchBrokerApi', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_BROKER_PLATFORM_BFF_URL = 'any_url';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('searchRegisterBroker should call bff service correctly', async () => {
    const mockData = {
        "type": 3
    };

    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return mockData;
      });

    const result = await SearchBrokerApi.searchRegisterBroker('43759422000158');

    expect(mockGet).toHaveBeenCalledWith({
      url: '/signup/broker/43759422000158',
    });
    expect(result).toBe(mockData);
  });
});

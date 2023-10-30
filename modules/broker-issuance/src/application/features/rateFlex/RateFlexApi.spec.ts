import { AxiosHttpClient } from '@infrastructure/http-client';
import RateFlexApi from './RateFlexApi';

describe('QuoteApi', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_BROKER_PLATFORM_BFF_URL = 'any_url';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getRateFlexEnabled should call bff service correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return {};
      });

    await RateFlexApi.getRateFlexEnabled(12345, 1);

    expect(mockGet).toHaveBeenCalledWith({
      url: 'api_policyholder/policyholders/12345/modality/1/flextaxenabled',
    });
  });
});

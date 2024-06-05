import { AxiosHttpClient } from '@infrastructure/http-client';
import QuotationPricingApi from './QuotationPricingApi';
import { PolicyholderBalanceLimitsDTO } from '../../types/dto';

describe('QuotationPricingApi', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_ISSUER_PLATFORM_BFF = 'any_url';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getPolicyholderBalanceLimits should call bff service correctly', async () => {
    const mockData: PolicyholderBalanceLimitsDTO = {
      availableLimit: 10000,
      availableFlexibilizationLimit: 15000,
      showFlexibilizationLimit: true,
    };
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return mockData;
      });
    const result = await QuotationPricingApi.getPolicyholderBalanceLimits(
      1234,
      99,
    );

    expect(mockGet).toHaveBeenCalledWith({
      url: '/v1/policyholders/1234/balance-limits',
      params: {
        modalityId: 99,
      },
    });
    expect(result).toBe(mockData);
  });
});

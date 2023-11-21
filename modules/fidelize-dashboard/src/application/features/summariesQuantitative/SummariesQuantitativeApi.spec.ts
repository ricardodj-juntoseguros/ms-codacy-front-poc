import { AxiosHttpClient } from '@infrastructure/http-client';
import SummaryApi from './SummariesQuantitativeApi';
import { SummariesQuantitativeByPolicyholderDTO } from '../../types/dto/SummariesQuantitativeByPolicyholderDTO';

describe('SummaryApi', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_FIDELIZE_BFF_URL = 'any_url';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getSummariesByPolicyholdersList should call bff service correctly using a list of policyholders', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => {
        return {
          companyName: 'Company Test',
          federalId: '123456',
          processesFound: {
            total: 130,
            federal: 100,
            labor: 30,
          },
        } as SummariesQuantitativeByPolicyholderDTO;
      });
    const result = await SummaryApi.getSummariesByPolicyholdersList(['123456']);

    expect(mockGet).toHaveBeenCalledWith({
      url: '/v1/policyholders/processes/quantitative',
      payload: ['123456'],
    });
    expect(result.processesFound.total).toBe(130);
    expect(result.processesFound.federal).toBe(100);
    expect(result.processesFound.labor).toBe(30);
    expect(result.companyName).toBe('Company Test');
    expect(result.federalId).toBe('123456');
  });
});

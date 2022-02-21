import { AxiosHttpClient } from '@infrastructure/http-client';
import { SummaryPolicyholdersDTO } from '../../types/dto/SummaryPolicyholdersDTO';
import SummaryApi from './SummaryApi';

describe('SummaryApi', () => {
  beforeAll(() => {
    process.env.NX_FID_BFF_URL = 'any_url';
  });

  it('getPolicyholdersTotal should call bff service correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return { totalPolicyholders: 100 } as SummaryPolicyholdersDTO;
      });
    const result = await SummaryApi.getPolicyholdersTotal();

    expect(mockGet).toHaveBeenCalledWith({
      url: '/opportunities/summary/policyholders',
    });
    expect(result.totalPolicyholders).toBe(100);
  });
});

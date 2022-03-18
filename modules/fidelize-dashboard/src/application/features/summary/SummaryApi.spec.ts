import { AxiosHttpClient } from '@infrastructure/http-client';
import { ModalitySummaryDTO, SummaryPolicyholdersDTO } from '../../types/dto';
import { ModalityEnum } from '../../types/model';
import SummaryApi from './SummaryApi';

describe('SummaryApi', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_FIDELIZE_BFF_URL = 'any_url';
  });

  it('getPolicyholdersTotal should call bff service correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return { totalPolicyholders: 100 } as SummaryPolicyholdersDTO;
      });
    const result = await SummaryApi.getPolicyholdersTotal();

    expect(mockGet).toHaveBeenCalledWith({
      url: '/v1/opportunities/summary/policyholders',
    });
    expect(result.totalPolicyholders).toBe(100);
  });

  it('getModalitiesSummary should call bff service correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return [
          {
            modality: 'fiscal',
            totalOpportunities: 100,
            totalInsuredAmount: 1000000,
          },
        ] as ModalitySummaryDTO[];
      });
    const result = await SummaryApi.getModalitiesSummary();

    expect(mockGet).toHaveBeenCalledWith({
      url: '/v1/opportunities/summary/modalities',
    });
    expect(result[0].modality).toBe(ModalityEnum.FISCAL);
    expect(result[0].totalOpportunities).toBe(100);
    expect(result[0].totalInsuredAmount).toBe(1000000);
  });
});

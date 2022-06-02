import { AxiosHttpClient } from '@infrastructure/http-client';
import { ModalitySummaryDTO } from '../../types/dto';
import { ModalityEnum } from '../../types/model';
import SummaryApi from './SummaryApi';

describe('SummaryApi', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_FIDELIZE_BFF_URL = 'any_url';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getModalitiesSummary should call bff service correctly without filtered policyholders', async () => {
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
    const result = await SummaryApi.getModalitiesSummary([]);

    expect(mockGet).toHaveBeenCalledWith({
      url: '/v1/opportunities/summary/modalities',
      params: {},
    });
    expect(result[0].modality).toBe(ModalityEnum.FISCAL);
    expect(result[0].totalOpportunities).toBe(100);
    expect(result[0].totalInsuredAmount).toBe(1000000);
  });

  it('getModalitiesSummary should call bff service correctly without filtered policyholders', async () => {
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
    const result = await SummaryApi.getModalitiesSummary([
      '11223344556677',
      '12345671234567',
    ]);

    expect(mockGet).toHaveBeenCalledWith({
      url: '/v1/opportunities/summary/modalities',
      params: { federalids: '11223344556677,12345671234567' },
    });
    expect(result[0].modality).toBe(ModalityEnum.FISCAL);
    expect(result[0].totalOpportunities).toBe(100);
    expect(result[0].totalInsuredAmount).toBe(1000000);
  });
});

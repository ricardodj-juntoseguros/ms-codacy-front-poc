import { AxiosHttpClient } from '@infrastructure/http-client';
import { ModalitiesSummaryDTO } from '../../types/dto';
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
        return {
          totalOpportunities: 100,
          totalInsuredAmount: 1000000,
          totalsModalities: [
            {
              modality: 'fiscal',
              totalOpportunities: 100,
              totalInsuredAmount: 1000000,
            },
          ]
        } as ModalitiesSummaryDTO;
      });
    const result = await SummaryApi.getModalitiesSummary([]);

    expect(mockGet).toHaveBeenCalledWith({
      url: '/v2/opportunities/summary/modalities',
      params: {},
    });
    expect(result.totalOpportunities).toBe(100);
    expect(result.totalInsuredAmount).toBe(1000000);
    expect(result.totalsModalities[0].modality).toBe(ModalityEnum.FISCAL);
    expect(result.totalsModalities[0].totalOpportunities).toBe(100);
    expect(result.totalsModalities[0].totalInsuredAmount).toBe(1000000);
  });

  it('getModalitiesSummary should call bff service correctly without filtered policyholders', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return {
          totalOpportunities: 100,
          totalInsuredAmount: 1000000,
          totalsModalities: [
            {
              modality: 'fiscal',
              totalOpportunities: 100,
              totalInsuredAmount: 1000000,
            },
          ]
        } as ModalitiesSummaryDTO;
      });
    const result = await SummaryApi.getModalitiesSummary([
      '11223344556677',
      '12345671234567',
    ]);

    expect(mockGet).toHaveBeenCalledWith({
      url: '/v2/opportunities/summary/modalities',
      params: { federalids: '11223344556677,12345671234567' },
    });
    expect(result.totalOpportunities).toBe(100);
    expect(result.totalInsuredAmount).toBe(1000000);
    expect(result.totalsModalities[0].modality).toBe(ModalityEnum.FISCAL);
    expect(result.totalsModalities[0].totalOpportunities).toBe(100);
    expect(result.totalsModalities[0].totalInsuredAmount).toBe(1000000);
  });
});

import { AxiosHttpClient } from '@infrastructure/http-client';
import { OpportunityDetailsDTO } from '../../types/dto';
import { ModalityEnum, OpportunityDetailsOrderEnum } from '../../types/model';
import OpportunitiesDetailsApi from './OpportunitiesDetailsApi';

describe('OpportunitiesDetailsApi', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_FIDELIZE_BFF_URL = 'any_url';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getOpportunitiesDetailsByModality should call bff service correctly for modality fiscal', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return {
          totalCount: 1,
          data: [
            {
              type: 'Fiscal',
              category: 'Renovação',
              securityAmount: 120000,
              expiration: '2025-03-19T03:00:00.000Z',
              mappingDate: '2022-03-18T03:00:00.000Z',
              policyholder: 'Tomador',
            },
          ],
        } as OpportunityDetailsDTO;
      });
    const result =
      await OpportunitiesDetailsApi.getOpportunitiesDetailsByModality(
        ModalityEnum.FISCAL,
        1,
        10,
        OpportunityDetailsOrderEnum.RELEVANCE,
        'desc',
        ['11223344556677', '12345671234567'],
      );

    expect(mockGet).toHaveBeenCalledWith({
      url: '/v1/opportunities/fiscal',
      params: {
        page: 1,
        pageSize: 10,
        orderBy: 'Relevance',
        direction: 'desc',
        federalids: '11223344556677,12345671234567',
      },
    });
    expect(result.data[0].category).toBe('Renovação');
    expect(result.data[0].type).toBe('Fiscal');
    expect(result.data[0].policyholder).toBe('Tomador');
    expect(result.data[0].expiration).toBe('2025-03-19T03:00:00.000Z');
    expect(result.data[0].mappingDate).toBe('2022-03-18T03:00:00.000Z');
    expect(result.data[0].securityAmount).toBe(120000);
  });

  it('sendMoreOpportunityDetailsMail should call bff service correctly', async () => {
    const httpMock = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => {
        return {
          success: true,
        };
      });
    const result = await OpportunitiesDetailsApi.sendMoreOpportunityDetailsMail(
      'sample-opportunity-id',
    );

    expect(httpMock).toHaveBeenCalledWith({
      url: '/v1/opportunities/mail/mapping-details',
      payload: { opportunityId: 'sample-opportunity-id' },
    });
    expect(result.success).toBe(true);
  });

  it('sendMoreDetailsFromOpportunityList should call bff service correctly', async () => {
    const httpMock = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => {
        return {
          success: true,
        };
      });

    const result =
      await OpportunitiesDetailsApi.sendMoreDetailsFromOpportunityList(
        ModalityEnum.TRABALHISTA,
        [
          'f39e3651-b5de-4344-a026-d56685f8760c',
          'ae0182cc-f2ca-4907-b953-a7da555acff6',
          '7212dff3-7205-419e-ae14-8bbdd5729742',
        ],
      );

    expect(httpMock).toHaveBeenCalledWith({
      url: '/v2/opportunities/labor/mapping-details',
      payload: {
        opportunities: [
          'f39e3651-b5de-4344-a026-d56685f8760c',
          'ae0182cc-f2ca-4907-b953-a7da555acff6',
          '7212dff3-7205-419e-ae14-8bbdd5729742',
        ],
      },
    });
    expect(result.success).toBe(true);
  });
});

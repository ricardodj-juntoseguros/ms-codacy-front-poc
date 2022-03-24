import { AxiosHttpClient } from '@infrastructure/http-client';
import { OpportunityDetailsDTO } from '../../types/dto';
import { ModalityEnum } from '../../types/model';
import OpportunitiesDetailsApi from './OpportunitiesDetailsApi';

describe('OpportunitiesDetailsApi', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_FIDELIZE_BFF_URL = 'any_url';
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
      );

    expect(mockGet).toHaveBeenCalledWith({
      url: '/v1/opportunities/fiscal',
      params: { page: 1, pageSize: 10 },
    });
    expect(result.data[0].category).toBe('Renovação');
    expect(result.data[0].type).toBe('Fiscal');
    expect(result.data[0].policyholder).toBe('Tomador');
    expect(result.data[0].expiration).toBe('2025-03-19T03:00:00.000Z');
    expect(result.data[0].mappingDate).toBe('2022-03-18T03:00:00.000Z');
    expect(result.data[0].securityAmount).toBe(120000);
  });
});

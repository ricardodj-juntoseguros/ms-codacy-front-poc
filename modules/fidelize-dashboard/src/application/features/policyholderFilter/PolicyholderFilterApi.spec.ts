import { AxiosHttpClient } from '@infrastructure/http-client';
import { PolicyholderDTO } from '../../types/dto';
import PolicyholderFilterApi from './PolicyholderFilterApi';

describe('PolicyholderFilterApi', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_FIDELIZE_BFF_URL = 'any_url';
  });

  it('getMappedPolicyholderList should call bff service correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return [
          {
            federalId: '11223344556677',
            name: 'teste tomador',
          },
        ] as PolicyholderDTO[];
      });
    const result = await PolicyholderFilterApi.getMappedPolicyholderList();

    expect(mockGet).toHaveBeenCalledWith({
      url: '/v1/policyholders',
    });

    expect(result[0].federalId).toBe('11223344556677');
    expect(result[0].name).toBe('teste tomador');
  });
});

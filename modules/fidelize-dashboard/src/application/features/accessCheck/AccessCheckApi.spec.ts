import { AxiosHttpClient } from '@infrastructure/http-client';
import AccessCheckApi from './AccessCheckApi';

describe('AccessCheckApi', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_FIDELIZE_BFF_URL = 'any_url';
  });

  it('checkAccessToDashboard should call bff service correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return 'OK';
      });
    const result = await AccessCheckApi.checkAccessToDashboard();
    expect(mockGet).toHaveBeenCalledWith({
      url: '/v1/access',
    });
    expect(result).toBe('OK');
  });
});

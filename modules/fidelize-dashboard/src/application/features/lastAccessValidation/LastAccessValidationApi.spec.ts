import { AxiosHttpClient } from '@infrastructure/http-client';
import LastAccessValidationApi from './LastAccessValidationApi';

describe('LastAccessValidationApi', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_FIDELIZE_BFF_URL = 'any_url';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getBrokerLastAccessDate should call bff service correctly', async () => {
    const httpMock = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return { lastAccess: '2023-01-01T12:00:00.000Z' };
      });

    const result = await LastAccessValidationApi.getBrokerLastAccessDate();
    expect(httpMock).toHaveBeenCalledWith({
      url: '/v2/access/information',
    });
    expect(result.lastAccess).toBe('2023-01-01T12:00:00.000Z');
  });

  it('saveBrokerLastAccess should call bff service correctly', async () => {
    const httpMock = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => {
        return { success: true };
      });

    await LastAccessValidationApi.saveBrokerLastAccess();
    expect(httpMock).toHaveBeenCalledWith({
      url: '/v2/access/information',
    });
  });
});

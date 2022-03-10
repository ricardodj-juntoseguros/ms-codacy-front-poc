import { AxiosHttpClient } from '@infrastructure/http-client';
import Cookies from 'js-cookie';
import FidelizeDashboardBaseApi from './FidelizeDashboardBaseApi';

describe('FidelizeDashboardBaseApi', () => {
  const mockCookie = `{"token": "any_token" }`;
  beforeAll(() => {
    process.env.NX_GLOBAL_FIDELIZE_BFF_URL = 'any_url';
  });

  it('getInstance should return an configured instance of AxiosHttpClient', async () => {
    const instance = new FidelizeDashboardBaseApi().getInstance();
    jest.spyOn(instance, 'get').mockImplementation(async () => {
      return { success: true };
    });
    const result = (await instance.get({ url: '' })) as any;
    expect(instance).toBeInstanceOf(AxiosHttpClient);
    expect(result.success).toBeTruthy();
  });

  it('getAuthorizationHeader should get access token from cookie', async () => {
    jest.spyOn(Cookies, 'get').mockReturnValue(mockCookie as any);
    const result = new FidelizeDashboardBaseApi().getHeaders();
    expect(result).toStrictEqual({ authorization: `Bearer any_token` });
  });
});

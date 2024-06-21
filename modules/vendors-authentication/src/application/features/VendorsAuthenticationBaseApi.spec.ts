import { AxiosHttpClient } from '@infrastructure/http-client';
import { AxiosResponse, AxiosError } from 'axios';
import Cookies from 'js-cookie';
import VendorsAuthenticationBaseApi from './VendorsAuthenticationBaseApi';

describe('VendorsAuthenticationBaseApi', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_VENDORS_BFF_URL = 'vendors_bff';
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { assign: jest.fn() },
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getInstance should return an configured instance of AxiosHttpClient', async () => {
    const instance = new VendorsAuthenticationBaseApi().getInstance();
    jest.spyOn(instance, 'get').mockImplementation(async () => {
      return { success: true };
    });
    const result = (await instance.get({ url: '' })) as any;
    expect(instance).toBeInstanceOf(AxiosHttpClient);
    expect(result.success).toBeTruthy();
  });

  it('handleSuccess interceptor should return the original response', async () => {
    const mockResponse = {
      status: 200,
      data: { success: true },
    } as AxiosResponse;

    const response = new VendorsAuthenticationBaseApi().handleSuccess(
      mockResponse,
    );

    expect(response).toStrictEqual(mockResponse);
  });

  it('handleErrors should throw error with response', async () => {
    const mockError = {
      response: {
        status: 404,
      },
      config: {
        baseURL: 'test_url',
        method: 'GET',
        headers: {},
      },
      toJSON: () => {
        console.log('JSON');
      },
      name: 'request',
      message: 'Error',
    } as AxiosError;

    let err = {} as any;
    await new VendorsAuthenticationBaseApi()
      .handleErrors(mockError)
      .catch(e => {
        err = e;
      });

    expect(err.status).toBe(404);
  });

  it('getAuthorizationHeader should get access token from cookie', async () => {
    const mockCookie = `{"token": "any_token", "refreshToken": "refresh_token", "useRefreshToken": true }`;

    jest.spyOn(Cookies, 'get').mockReturnValue(mockCookie as any);
    const result = new VendorsAuthenticationBaseApi().getHeaders();
    expect(result).toStrictEqual({ authorization: `Bearer any_token` });
  });
});

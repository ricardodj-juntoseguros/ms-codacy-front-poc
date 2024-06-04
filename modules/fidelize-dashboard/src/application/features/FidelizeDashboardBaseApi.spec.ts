import { AxiosHttpClient } from '@infrastructure/http-client';
import { BrokerPlatformAuthService } from '@services';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import FidelizeDashboardBaseApi from './FidelizeDashboardBaseApi';

describe('FidelizeDashboardBaseApi', () => {
  const mockCookie = `{"token": "any_token", "refreshToken": "refresh_token", "useRefreshToken": true }`;
  beforeAll(() => {
    process.env.NX_GLOBAL_BROKER_PLATFORM_URL = 'broker_login_url';
    process.env.NX_GLOBAL_FIDELIZE_BFF_URL = 'any_url';
    process.env.NX_FID_APP_URL = 'fidelize_app_url';

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { assign: jest.fn() },
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
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

  it('handleSuccess interceptor should return the original response', () => {
    const mockResponse = {
      status: 200,
      data: { success: true },
    } as AxiosResponse;

    const response = new FidelizeDashboardBaseApi().handleSuccess(mockResponse);
    expect(response).toStrictEqual(mockResponse);
  });

  it('handleErrors interceptor should handle unauthorized errors accordingly', async () => {
    const mockError = {
      response: {
        status: 401,
      },
      config: {
        baseURL: 'test_url',
        method: 'GET',
        headers: { authorization: 'bearer token' } as any,
      },
      isAxiosError: false,
      toJSON: () => {
        console.log('JSON');
      },
      name: 'request',
      message: 'Error',
    } as AxiosError;

    const getUserCookieMock = jest
      .spyOn(BrokerPlatformAuthService, 'getUserAccessCookie')
      .mockImplementation(() => {
        return { refreshToken: 'refresh_token', useRefreshToken: true };
      });

    const setUserCookieMock = jest
      .spyOn(BrokerPlatformAuthService, 'setUserAccessCookie')
      .mockImplementation();

    const refreshTokenMock = jest
      .spyOn(BrokerPlatformAuthService, 'doRefreshToken')
      .mockImplementation(async () => {
        return {
          refresh_token: 'new_refresh_token',
          access_token: 'new_access_token',
          expires_in: 900,
          refresh_expires_in: 1800,
        };
      });

    jest.spyOn(axios, 'request').mockImplementation(async () => {
      return 'ok';
    });
    await new FidelizeDashboardBaseApi().handleErrors(mockError);
    expect(getUserCookieMock).toHaveBeenCalled();
    expect(setUserCookieMock).toHaveBeenCalledTimes(1);
    expect(refreshTokenMock).toHaveBeenCalledTimes(1);
    expect(axios.request).toHaveBeenCalledTimes(1);
  });

  it('handleErrors should redirect to broker login if is unauthorized error and there is no user access cookie', async () => {
    const mockError = {
      response: {
        status: 401,
      },
      config: {
        baseURL: 'test_url',
        method: 'GET',
        headers: { authorization: 'bearer token' } as any,
      },
      toJSON: () => {
        console.log('JSON');
      },
      name: 'request',
      message: 'Error',
    } as AxiosError;

    jest
      .spyOn(BrokerPlatformAuthService, 'getUserAccessCookie')
      .mockImplementation(() => {
        return null;
      });

    await new FidelizeDashboardBaseApi().handleErrors(mockError);
    expect(window.location.assign).toHaveBeenCalledWith(
      'broker_login_url?redirectUrl=fidelize_app_url',
    );
  });

  it('handleError should clear auth data and redirect to broker login if is unauthorized error and refresh token fails', async () => {
    const mockError = {
      response: {
        status: 401,
      },
      config: {
        baseURL: 'test_url',
        method: 'GET',
        headers: { authorization: 'bearer token' } as any,
      },
      toJSON: () => {
        console.log('JSON');
      },
      name: 'request',
      message: 'Error',
    } as AxiosError;

    jest
      .spyOn(BrokerPlatformAuthService, 'getUserAccessCookie')
      .mockImplementation(() => {
        return { refreshToken: 'refresh_token', useRefreshToken: true };
      });

    jest
      .spyOn(BrokerPlatformAuthService, 'doRefreshToken')
      .mockImplementation(async () => {
        return Promise.reject();
      });

    jest
      .spyOn(BrokerPlatformAuthService, 'clearAuthData')
      .mockImplementation(jest.fn());

    await new FidelizeDashboardBaseApi()
      .handleErrors(mockError)
      .catch(e => console.log(e));

    expect(window.location.assign).toHaveBeenCalledWith(
      'broker_login_url?redirectUrl=fidelize_app_url',
    );
    expect(BrokerPlatformAuthService.clearAuthData).toHaveBeenCalledTimes(1);
  });
});

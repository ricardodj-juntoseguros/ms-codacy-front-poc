import { AxiosHttpClient } from '@infrastructure/http-client';
import { BrokerPlatformAuthService } from '@services';
import axios, { AxiosResponse, AxiosError } from 'axios';
import BrokerIssuanceBaseApi from './BrokerIssuanceBaseApi';

describe('BrokerIssuanceBaseApi', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_BROKER_PLATFORM_BFF_URL = 'vendors_bff';
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { assign: jest.fn() },
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getInstance should return an configured instance of AxiosHttpClient', async () => {
    const instance = new BrokerIssuanceBaseApi().getInstance();
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

    const response = new BrokerIssuanceBaseApi().handleSuccess(mockResponse);

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
        headers: { authorization: null },
      },
    } as AxiosError;

    let err = {} as any;
    await new BrokerIssuanceBaseApi().handleErrors(mockError).catch(e => {
      err = e;
    });

    expect(err.status).toBe(404);
  });

  it('handleErrors should call refresh token and update user cookie and instance headers', async () => {
    jest.mock('axios');
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    const mockError = {
      response: {
        status: 401,
      },
      config: {
        baseURL: 'test_url',
        method: 'GET',
        headers: { authorization: 'bearer any_token' },
      },
    } as AxiosError;
    jest
      .spyOn(BrokerPlatformAuthService, 'getUserAccessCookie')
      .mockImplementation(() => {
        return {
          refreshToken: 'any_refresh_token',
        };
      });
    jest
      .spyOn(BrokerPlatformAuthService, 'setUserAccessCookie')
      .mockImplementation(() => {
        return true;
      });
    jest
      .spyOn(BrokerPlatformAuthService, 'doRefreshToken')
      .mockImplementation(async () => {
        return {
          access_token: 'new_token',
          refresh_token: 'new_refresh_token',
          expires_in: 900,
          refresh_expires_in: 1800,
        };
      });
    jest.spyOn(axios, 'request').mockImplementation(async () => {
      return { success: true };
    });
    const testInstance = new BrokerIssuanceBaseApi();
    await testInstance.handleErrors(mockError);
    expect(BrokerPlatformAuthService.getUserAccessCookie).toHaveBeenCalled();
    expect(BrokerPlatformAuthService.doRefreshToken).toHaveBeenCalled();
    expect(BrokerPlatformAuthService.setUserAccessCookie).toHaveBeenCalledWith(
      { "access_token": "new_token", "expires_in": 900, "refresh_expires_in": 1800, "refresh_token": "new_refresh_token" }, 900);
    expect(
      testInstance.getInstance().instance.defaults.headers.Authorization,
    ).toBe('bearer new_token');
  });
});

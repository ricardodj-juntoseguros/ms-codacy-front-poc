/* eslint-disable @typescript-eslint/no-empty-function */
import { AxiosHttpClient } from '@infrastructure/http-client';
import { BrokerPlatformAuthService } from '@services';
import axios, { AxiosResponse, AxiosError } from 'axios';
import LeaseBondsInssuanceBaseApi from './LeaseBondsIssuanceBaseApi';

describe('LeaseBondsInssuanceBaseApi', () => {
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
    const instance = new LeaseBondsInssuanceBaseApi().getInstance();
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

    const response = new LeaseBondsInssuanceBaseApi().handleSuccess(mockResponse);

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
      isAxiosError: false,
      toJSON: () => {},
      name: 'request',
      message: 'Error',
    } as AxiosError;

    let err = {} as any;
    await new LeaseBondsInssuanceBaseApi().handleErrors(mockError).catch(e => {
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
        headers: {
          authorization: 'bearer any_token',
        } as any,
      },
      isAxiosError: false,
      toJSON: () => {},
      name: 'request',
      message: 'Error',
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
    const testInstance = new LeaseBondsInssuanceBaseApi();
    await testInstance.handleErrors(mockError);
    expect(BrokerPlatformAuthService.getUserAccessCookie).toHaveBeenCalled();
    expect(BrokerPlatformAuthService.doRefreshToken).toHaveBeenCalled();
    expect(BrokerPlatformAuthService.setUserAccessCookie).toHaveBeenCalled();
    expect(
      testInstance.getInstance().instance.defaults.headers.authorization,
    ).toBe('bearer new_token');
  });
});

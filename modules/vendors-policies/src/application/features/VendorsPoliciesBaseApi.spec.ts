import { AxiosHttpClient } from '@infrastructure/http-client';
import { VendorsAuthService } from '@services';
import axios, { AxiosResponse, AxiosError } from 'axios';
import VendorsPoliciesBaseApi, { getInstance } from './VendorsPoliciesBaseApi';

describe('VendorsPoliciesBaseApi', () => {
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
    const instance = getInstance();
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

    const response = new VendorsPoliciesBaseApi().handleSuccess(mockResponse);

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
    await new VendorsPoliciesBaseApi().handleErrors(mockError).catch(e => {
      err = e;
    });

    expect(err.status).toBe(404);
  });

  it('handleErrors should call refresh token and update user cookie and instance headers', async () => {
    jest.mock('axios');
    const mockError = {
      response: {
        status: 401,
      },
      config: {
        baseURL: 'test_url',
        method: 'GET',
        headers: { authorization: 'bearer any_token' } as any,
      },
      toJSON: () => {
        console.log('JSON');
      },
      name: 'request',
      message: 'Error',
    } as AxiosError;
    jest
      .spyOn(VendorsAuthService, 'getUserAccessCookie')
      .mockImplementation(() => {
        return {
          refreshToken: 'any_refresh_token',
        };
      });
    jest
      .spyOn(VendorsAuthService, 'setUserAccessCookie')
      .mockImplementation(() => {
        return true;
      });
    jest
      .spyOn(VendorsAuthService, 'doRefreshToken')
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
    const testInstance = new VendorsPoliciesBaseApi();
    await testInstance.handleErrors(mockError);
    expect(VendorsAuthService.getUserAccessCookie).toHaveBeenCalled();
    expect(VendorsAuthService.doRefreshToken).toHaveBeenCalled();
    expect(VendorsAuthService.setUserAccessCookie).toHaveBeenCalledWith(
      'new_token',
      'new_refresh_token',
      900,
      1800,
    );
    expect(
      testInstance.getInstance().instance.defaults.headers.Authorization,
    ).toBe('bearer new_token');
  });
});

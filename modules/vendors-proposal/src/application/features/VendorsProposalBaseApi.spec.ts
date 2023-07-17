import { AxiosHttpClient } from '@infrastructure/http-client';
import { VendorsAuthService } from '@services';
import axios, { AxiosResponse, AxiosError } from 'axios';
import VendorsProposalBaseApi from './VendorsProposalBaseApi';

describe('VendorsPreApprovalBaseApi', () => {
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
    const instance = new VendorsProposalBaseApi().getInstance();
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

    const response = new VendorsProposalBaseApi().handleSuccess(mockResponse);

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
    await new VendorsProposalBaseApi().handleErrors(mockError).catch(e => {
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
    const testInstance = new VendorsProposalBaseApi();
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

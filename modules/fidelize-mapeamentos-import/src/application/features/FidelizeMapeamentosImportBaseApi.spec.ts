import { AxiosHttpClient } from '@infrastructure/http-client';
import { AxiosResponse, AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { BackofficeAuthService } from '@services';
import FidelizeImportMapeamentosBaseApi from './FidelizeMapeamentosImportBaseApi';

describe('FidelizeImportMapeamentosBaseApi', () => {
  const mockCookie = `{"token": "any_token", "refreshToken": "refresh_token", "useRefreshToken": true }`;
  beforeAll(() => {
    process.env.NX_GLOBAL_BACKOFFICE_PLATFORM_URL = 'backoffice_test';

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { assign: jest.fn() },
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getInstance should return an configured instance of AxiosHttpClient', async () => {
    const instance = new FidelizeImportMapeamentosBaseApi().getInstance();
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

    const response = new FidelizeImportMapeamentosBaseApi().handleSuccess(
      mockResponse,
    );

    expect(response).toStrictEqual(mockResponse);
  });

  it('handleErrors should redirect to backoffice login if is unauthorized error and there is no user access token on localstorage', async () => {
    const mockError = {
      response: {
        status: 401,
      },
      config: {
        baseURL: 'test_url',
        method: 'GET',
        headers: { authorization: null },
      },
    } as AxiosError;

    const getToken = jest
      .spyOn(BackofficeAuthService, 'getAuthToken')
      .mockImplementation(() => {
        return null;
      });

    await new FidelizeImportMapeamentosBaseApi()
      .handleErrors(mockError)
      .catch(e => console.log(e));

    expect(getToken).toHaveBeenCalledTimes(1);
    expect(window.location.assign).toHaveBeenCalledWith(
      'backoffice_test/logout',
    );
  });
});

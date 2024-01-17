import { AxiosHttpClient } from '@infrastructure/http-client';
import { AxiosResponse, AxiosError } from 'axios';
import { BackofficeAuthService } from '@services';
import FidelizeImportMapeamentosBaseApi from './FidelizeMapeamentosImportBaseApi';

describe('FidelizeImportMapeamentosBaseApi ', () => {
  const token =
    'eyJhbGciOiJSUzI1NiIsImtpZCI6IjY4NEEyNEU2MEEzNDFGN0UyN0FEMEY0RjYzREI4NDBFOUFERDZBNjIiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJhRW9rNWdvMEgzNG5yUTlQWTl1RURwcmRhbUkifQ.eyJuYmYiOjE2ODY1NzI0NTksImV4cCI6MTY4NjYxNTY1OSwiaXNzIjoiaHR0cHM6Ly9tcy1nYXRld2F5LXFhcy5qdW50b3NlZ3Vyb3MuY29tL3NxdWFkNi9hdXRoIiwiYXVkIjpbImh0dHBzOi8vbXMtZ2F0ZXdheS1xYXMuanVudG9zZWd1cm9zLmNvbS9zcXVhZDYvYXV0aC9yZXNvdXJjZXMiLCJiYWNrb2ZmaWNlIiwidXNlcnMiXSwiY2xpZW50X2lkIjoiUGxhdGFmb3JtYUJhY2tvZmZpY2UiLCJzdWIiOiJwYWluZWxfYmFja29mZmljZV9xYSIsImF1dGhfdGltZSI6MTY4NjU3MjQ1MSwiaWRwIjoibG9jYWwiLCJVc2VySWQiOiIxNTg0OCIsIlR5cGUiOiIxIiwiVXNlclR5cGUiOiJQb2xpY3lob2xkZXIiLCJuYW1lIjoicGFpbmVsX2JhY2tvZmZpY2VfcWEiLCJpc1N1c2VwVmFsaWRhdGVkIjoiRmFsc2UiLCJwZXJtaXNzaW9ucy5zdWJkZXBhcnRtZW50IjpbInJqIiwicHIiLCJzcCIsImFtIiwiYmEiLCJjZSIsImRmIiwiZXMiLCJwYSIsIm1nIiwicGUiLCJycyIsInNjIiwib3Bwb3J0dW5pdHlyZXF1ZXN0IiwibWF0cml6Il0sImlkIjoiNmVkMDU5ZjQtOTBlNC00MjA4LThlYzAtOGNkM2I2OTI1ODYwIiwicm9sZSI6ImNvbW1lcmNpYWwiLCJzY29wZSI6WyJiYWNrb2ZmaWNlIiwidXNlcnMiXSwiYW1yIjpbInB3ZCJdfQ.DRQ93JOEvd12kXRiUG3pV9MxUiYgF0uyAwydoqXgGJrbx1W6NXOi44JbeQ77frZQ1TvFBpMmRHvF3RciBNwv1-NHFJF1mdYDlPefwjBAMZSO7Mkt71oh9c2F39Xdb1e_ul8llcbSUE4FJYbN1fbMUKTVfPq16R2zwcDF7p0BsIqyQQn8p46lopTFpZOqDSGOuPEbkUDvsDS0AsLBE8c6j4LofRW1xP8-IntcHeZ271NGah51zP_UoB4OpDmMzjI1ypwP3IYyt2uE7DfDnvqzY_u1ZcRLD_KFvxJ2bNnrDsv-sKGiQFixIQ7yvXWVSHSkNAX2JCRQA9iphX2r2EVLMA';
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

    const getToken = jest
      .spyOn(BackofficeAuthService, 'getAuthToken')
      .mockImplementation(() => {
        return `Bearer ${token}`;
      });

    const response = new FidelizeImportMapeamentosBaseApi().handleSuccess(
      mockResponse,
    );
    expect(getToken).toHaveBeenCalledTimes(1);
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
        headers: { authorization: null } as any,
      },
      toJSON: () => {
        console.log('JSON');
      },
      name: 'request',
      message: 'Error',
    } as AxiosError;

    const getToken = jest
      .spyOn(BackofficeAuthService, 'getAuthToken')
      .mockImplementation(() => {
        return `Bearer ${token}`;
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

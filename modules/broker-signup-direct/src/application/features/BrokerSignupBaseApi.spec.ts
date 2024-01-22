/* eslint-disable @typescript-eslint/no-empty-function */
import { AxiosHttpClient } from '@infrastructure/http-client';
import { BrokerPlatformAuthService } from '@services';
import axios, { AxiosResponse, AxiosError } from 'axios';
import BrokerSignupBaseApi from './BrokerSignupBaseApi';

describe('BrokerSignupBaseApi', () => {
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
    const instance = new BrokerSignupBaseApi().getInstance();
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

    const response = new BrokerSignupBaseApi().handleSuccess(mockResponse);

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
    await new BrokerSignupBaseApi().handleErrors(mockError).catch(e => {
      err = e;
    });

    expect(err.status).toBe(404);
  });
});

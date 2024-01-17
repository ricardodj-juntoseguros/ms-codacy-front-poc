/* eslint-disable camelcase */
import { AxiosError, AxiosResponse } from 'axios';
import { AxiosHttpClient } from '@infrastructure/http-client';
import { BrokerPlatformAuthService } from '@services';

class BrokerSignupBaseApi {
  private readonly BASE_URL =
    process.env.NX_GLOBAL_BROKER_PLATFORM_BFF_URL || '';

  private headers = {};

  private timeout = 1000000;

  private instance: AxiosHttpClient;

  public constructor() {
    this.headers = {
      authorization: this.getAuthorizationHeader(),
    };
    this.instance = new AxiosHttpClient(
      this.BASE_URL,
      this.headers,
      this.timeout,
    );
    this.instance.setResponseInterceptors(
      this.handleSuccess,
      this.handleErrors,
    );
  }

  private getAuthorizationHeader(): string {
    const userCookie = BrokerPlatformAuthService.getUserAccessCookie();
    if (!userCookie) return '';
    const { token } = userCookie;
    return `Bearer ${token}`;
  }

  handleSuccess(value: AxiosResponse<any>) {
    return value;
  }

  handleErrors(error: AxiosError) {
    return Promise.reject(error.response || error);
  }

  public getHeaders() {
    return this.headers;
  }

  public getInstance(): AxiosHttpClient {
    return this.instance;
  }
}

export default BrokerSignupBaseApi;

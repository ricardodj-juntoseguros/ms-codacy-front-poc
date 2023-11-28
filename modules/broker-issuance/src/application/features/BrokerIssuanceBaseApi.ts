/* eslint-disable camelcase */
import { AxiosHttpClient } from '@infrastructure/http-client';
import { BrokerPlatformAuthService } from '@services';
import axios, { AxiosError, AxiosResponse } from 'axios';

export class BrokerInssuanceBaseApi {
  private readonly BASE_URL =
    process.env.NX_GLOBAL_ISSUER_PLATFORM_BFF || '';

  private headers = {};

  private timeout = 1000000;

  private instance: AxiosHttpClient;

  public constructor() {
    this.headers = {
      'Content-Type': 'application/json',
      authorization: this.getAuthorizationHeader(),
    };
    this.instance = new AxiosHttpClient(
      this.BASE_URL,
      this.headers,
      this.timeout,
    );
    this.instance.setResponseInterceptors(
      this.handleSuccess.bind(this),
      this.handleErrors.bind(this),
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

  async handleErrors(error: AxiosError) {
    const { config: originalRequest } = error;
    if (!error.response || error.response.status === 401) {
      const userCookie = BrokerPlatformAuthService.getUserAccessCookie();
      const brokerLoginUrl = process.env.NX_GLOBAL_BROKER_PLATFORM_URL || '';
      if (!userCookie || !userCookie.refreshToken) {
        window.location.assign(brokerLoginUrl);
        return null;
      }
      try {
        const refreshResponse =
          (await BrokerPlatformAuthService.doRefreshToken()) as any;
        const { refresh_expires_in, expires_in, access_token, refresh_token } =
          refreshResponse;
        BrokerPlatformAuthService.setUserAccessCookie(
          {
            access_token,
            refresh_token,
            expires_in,
            refresh_expires_in
          },
          expires_in
        );
        originalRequest.headers.Authorization = `bearer ${access_token}`;
        this.headers = {
          'Content-Type': 'application/json',
          Authorization: `bearer ${access_token}`,
        };
        this.instance.instance.defaults.headers = this.headers;
        return Promise.resolve(axios.request(originalRequest));
      } catch (err) {
        BrokerPlatformAuthService.clearAuthData();
        window.location.assign(brokerLoginUrl);
        return Promise.reject(err);
      }
    }
    return Promise.reject(error.response || error);
  }

  public getHeaders() {
    return this.headers;
  }

  public getInstance(): AxiosHttpClient {
    return this.instance;
  }
}

export const getInstance = () => new BrokerInssuanceBaseApi().getInstance();

export default BrokerInssuanceBaseApi;


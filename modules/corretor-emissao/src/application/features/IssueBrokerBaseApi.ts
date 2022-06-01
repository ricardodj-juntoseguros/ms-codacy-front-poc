import { AxiosHttpClient } from '@infrastructure/http-client';
import { BrokerPlatformAuthService } from '@services';
import axios, { AxiosError, AxiosResponse } from 'axios';

export class IssueBrokerBaseApi {
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
    const { config: originalRequest } = error;
    const userCookie = BrokerPlatformAuthService.getUserAccessCookie();
    const brokerLoginUrl = process.env.NX_GLOBAL_BROKER_PLATFORM_URL || '';
    const currentLocationUrl = window.location.href;

    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error.response || error);
    }

    if (
      !userCookie ||
      !userCookie.refreshToken ||
      !userCookie.useRefreshToken
    ) {
      window.location.assign(
        `${brokerLoginUrl}?redirectUrl=${currentLocationUrl}`,
      );
    }

    return new Promise((resolve, reject) => {
      BrokerPlatformAuthService.doRefreshToken()
        .then(response => {
          const {
            access_token: accessToken,
            expires_in: expiresIn,
            refresh_token: refreshToken,
            refresh_expires_in: refreshExpiresIn,
          } = response as any;

          const expiresInMilliseconds = (refreshExpiresIn || expiresIn) * 1000;
          const cookieExpiresIn = new Date(
            new Date().getTime() + expiresInMilliseconds,
          );

          BrokerPlatformAuthService.setUserAccessCookie(
            {
              ...userCookie,
              token: accessToken,
              refreshToken,
              expiresIn,
              refreshExpiresIn,
              createAt: new Date().toISOString(),
            },
            cookieExpiresIn,
          );

          originalRequest.headers.authorization = `Bearer ${accessToken}`;
          resolve(axios.request(originalRequest));
        })
        .catch(error => {
          BrokerPlatformAuthService.clearAuthData();
          window.location.assign(
            `${brokerLoginUrl}?redirectUrl=${currentLocationUrl}`,
          );
          reject(error);
        });
    });
  }

  public getHeaders() {
    return this.headers;
  }

  public getInstance(): AxiosHttpClient {
    return this.instance;
  }
}

export default IssueBrokerBaseApi;

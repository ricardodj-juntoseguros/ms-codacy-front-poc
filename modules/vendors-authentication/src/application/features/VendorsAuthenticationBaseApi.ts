/* eslint-disable camelcase */
import axios, { AxiosError, AxiosResponse } from 'axios';
import { AxiosHttpClient } from '@infrastructure/http-client';
import { VendorsAuthService } from '@services';

class VendorsAuthenticationBaseApi {
  private readonly BASE_URL = process.env.NX_GLOBAL_VENDORS_BFF_URL || '';

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
    const userCookie = VendorsAuthService.getUserAccessCookie();
    if (!userCookie) return '';
    const { token } = userCookie;
    return `Bearer ${token}`;
  }

  handleSuccess(value: AxiosResponse<any>) {
    return value;
  }

  handleErrors(error: AxiosError) {
    const { config: originalRequest } = error;
    const { url } = originalRequest;
    if (error.response && error.response.status === 401) {
      // handle unauthorized error, try to refresh the user tokens
      const userCookie = VendorsAuthService.getUserAccessCookie();
      const VendorsLoginUrl = process.env.NX_GLOBAL_VENDORS_PLATFORM_URL || '';
      const currentLocationUrl = window.location.href;
      const requestLogin = url === '/api/v1/login';
      if (
        !requestLogin &&
        (!userCookie || !userCookie.refreshToken || !userCookie.useRefreshToken)
      ) {
        window.location.assign(
          `${VendorsLoginUrl}?redirectUrl=${currentLocationUrl}`,
        );
      }

      return new Promise((resolve, reject) => {
        VendorsAuthService.doRefreshToken()
          .then(response => {
            const {
              refresh_expires_in,
              expires_in,
              access_token,
              refresh_token,
            } = response as any;

            const cookieExpiresIn = new Date(
              new Date().getTime() + (refresh_expires_in || expires_in) * 1000,
            );
            VendorsAuthService.setUserAccessCookie(
              {
                ...userCookie,
                token: access_token,
                refreshToken: refresh_token,
                expiresIn: expires_in * 1000,
                refreshExpiresIn: refresh_expires_in * 1000,
                createAt: new Date().toISOString(),
              },
              cookieExpiresIn,
            );
            originalRequest.headers.authorization = `bearer ${access_token}`;
            resolve(axios.request(originalRequest));
          })
          .catch(e => {
            VendorsAuthService.clearAuthData();
            window.location.assign(
              `${VendorsLoginUrl}?redirectUrl=${currentLocationUrl}`,
            );
            reject(e);
          });
      });
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

export default VendorsAuthenticationBaseApi;

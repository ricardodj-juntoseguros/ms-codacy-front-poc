/* eslint-disable camelcase */
import axios, { AxiosError, AxiosResponse } from 'axios';
import { VendorsAuthService } from '@services';
import { AxiosHttpClient } from '@infrastructure/http-client';

class PreApprovalBaseAPI {
  private readonly BASE_URL = `${process.env.NX_GLOBAL_VENDORS_BFF_URL}`;

  private headers = {};

  private timeout = 1000000;

  private instance: AxiosHttpClient;

  public constructor() {
    this.headers = {
      'Content-Type': 'application/json',
      Authorization: this.getAuthorizationHeader(),
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
    const userCookie = VendorsAuthService.getUserAccessCookie();
    if (!userCookie) return '';
    const { token } = userCookie;
    return `Bearer ${token}`;
  }

  handleSuccess(value: AxiosResponse<any>) {
    return value;
  }

  async handleErrors(error: AxiosError) {
    const { config: originalRequest } = error;
    if (error.response && error.response.status === 401) {
      // handle unauthorized error, try to refresh the user tokens
      const userCookie = VendorsAuthService.getUserAccessCookie();
      const vendorsLoginUrl = process.env.NX_GLOBAL_VENDORS_PLATFORM_URL || '';
      if (!userCookie || !userCookie.refreshToken || !originalRequest) {
        window.location.assign(vendorsLoginUrl);
        return null;
      }
      try {
        const refreshResponse =
          (await VendorsAuthService.doRefreshToken()) as any;
        const { refresh_expires_in, expires_in, access_token, refresh_token } =
          refreshResponse;
        VendorsAuthService.setUserAccessCookie(
          access_token,
          refresh_token,
          expires_in,
          refresh_expires_in,
        );
        originalRequest.headers.Authorization = `bearer ${access_token}`;
        this.headers = {
          'Content-Type': 'application/json',
          Authorization: `bearer ${access_token}`,
        };
        this.instance.instance.defaults.headers.Authorization = `bearer ${access_token}`;
        return Promise.resolve(axios.request(originalRequest));
      } catch (err) {
        VendorsAuthService.clearAuthData();
        window.location.assign(vendorsLoginUrl);
        return Promise.reject(err);
      }
    }
    return Promise.reject(error.response || error);
  }

  public getInstance(): AxiosHttpClient {
    return this.instance;
  }
}

export default PreApprovalBaseAPI;

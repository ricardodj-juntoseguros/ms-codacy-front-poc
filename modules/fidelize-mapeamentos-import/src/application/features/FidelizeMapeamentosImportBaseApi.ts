/* eslint-disable camelcase */
import { AxiosError, AxiosResponse } from 'axios';
import { AxiosHttpClient } from '@infrastructure/http-client';
import { BackofficeAuthService } from '@services';

class FidelizeImportMapeamentosBaseApi {
  private readonly BASE_URL = `${process.env.NX_GLOBAL_GATEWAY_URL}`;

  private headers = {};

  private timeout = 1000000;

  private instance: AxiosHttpClient;

  public constructor() {
    this.headers = {
      authorization: this.getAuthorizationHeader(),
      'Content-Type': 'application/json',
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
    const userToken = BackofficeAuthService.getAuthToken();

    if (!userToken) return '';

    const token = userToken;
    return `Bearer ${token}`;
  }

  handleSuccess(value: AxiosResponse<any>) {
    return value;
  }

  handleErrors(error: AxiosError) {
    if (error.response && error.response.status === 401) {
      BackofficeAuthService.clearAuthData();
      window.location.assign(
        `${process.env.NX_GLOBAL_BACKOFFICE_PLATFORM_URL}/logout`,
      );
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

export default FidelizeImportMapeamentosBaseApi;

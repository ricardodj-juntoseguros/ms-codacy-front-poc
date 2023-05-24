/* eslint-disable camelcase */
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { AxiosHttpClient } from '@infrastructure/http-client';

class VendorsProposalBaseApi {
  private readonly BASE_URL = `${process.env.NX_GLOBAL_VENDORS_BFF_URL}`;

  private headers = {};

  private timeout = 1000000;

  private instance: AxiosHttpClient;

  public constructor() {
    this.headers = {
      'Content-Type': 'application/json',
    };
    this.instance = new AxiosHttpClient(
      this.BASE_URL,
      this.headers,
      this.timeout,
    );
    this.instance.setRequestInterceptors(this.handleRequestSuccess);
    this.instance.setResponseInterceptors(
      this.handleSuccess,
      this.handleErrors,
    );
  }

  async handleRequestSuccess(config: AxiosRequestConfig) {
    const tokenResponse = await axios.request({
      method: 'POST',
      url: `${process.env.NX_GLOBAL_VENDORS_BFF_URL}/api/v1/login`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: `username=adm_brk&password=Parana.123`,
    });
    const token = `Bearer ${tokenResponse.data.access_token}`;
    return { ...config, headers: { ...config.headers, Authorization: token } };
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

export default VendorsProposalBaseApi;

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from 'axios';
import { IHttpClient } from '../IHttpClient';
import IHttpClientRequestParameters from '../types/IHttpClientRequestParameters';

export class AxiosHttpClient implements IHttpClient {
  protected readonly instance: AxiosInstance;

  public constructor(baseURL: string, headers?: any, timeout?: number) {
    this.instance = axios.create({
      baseURL,
      timeout,
      headers,
    });
  }

  public delete<T>(parameters: IHttpClientRequestParameters): Promise<T> {
    return this.doRequest(parameters, 'DELETE');
  }

  public get<T>(parameters: IHttpClientRequestParameters): Promise<T> {
    return this.doRequest(parameters, 'GET');
  }

  public patch<T>(parameters: IHttpClientRequestParameters): Promise<T> {
    return this.doRequest(parameters, 'PATCH');
  }

  public post<T>(parameters: IHttpClientRequestParameters): Promise<T> {
    return this.doRequest(parameters, 'POST');
  }

  public put<T>(parameters: IHttpClientRequestParameters): Promise<T> {
    return this.doRequest(parameters, 'PUT');
  }

  public setResponseInterceptors<T>(
    successHandler?: (
      value: AxiosResponse<T>,
    ) => Promise<AxiosResponse<T>> | AxiosResponse<T>,
    errorHandler?: (error: any) => Promise<any>,
  ) {
    this.instance.interceptors.response.use(successHandler, errorHandler);
  }

  public setRequestInterceptors(
    successHandler?: (config: AxiosRequestConfig) => AxiosRequestConfig,
    errorHandler?: (error: any) => Promise<any>,
  ) {
    this.instance.interceptors.request.use(successHandler, errorHandler);
  }

  private doRequest<T>(
    parameters: IHttpClientRequestParameters,
    method: Method,
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const { url, headers, payload } = parameters;

      const options: AxiosRequestConfig = {
        url,
        headers,
        method,
        data: payload,
      };

      this.instance
        .request(options)
        .then((response: AxiosResponse<T>) => {
          resolve(response.data);
        })
        .catch((response: AxiosError<T>) => {
          reject(response);
        });
    });
  }
}

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { IHttpClient } from "../IHttpClient";
import IHttpClientRequestParameters from "../types/IHttpClientRequestParameters";

export class AxiosHttpClient implements IHttpClient {
  protected readonly instance: AxiosInstance;

  public constructor(baseURL: string, timeout?: number) {
    this.instance = axios.create({
      baseURL,
      timeout
    });

    // this._initializeResponseInterceptor();
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

  private doRequest<T>(parameters: IHttpClientRequestParameters, method: Method): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const { url, headers, payload } = parameters

      const options: AxiosRequestConfig = {
        url,
        headers,
        method,
        data: payload
      }

      this.instance.request(options)
        .then((response: any) => {
          resolve(response.data as T)
        })
        .catch((response: any) => {
          reject(response)
        })
    });
  }

  // private _initializeResponseInterceptor = () => {
  //   this.instance.interceptors.response.use(
  //     this._handleResponse,
  //     this._handleError,
  //   );
  // };

  // private _handleResponse = ({ data }: AxiosResponse) => data;

  // protected _handleError = (error: any) => Promise.reject(error);
}

import { IHttpClient } from "../IHttpClient";
import IHttpClientRequestParameters from "../types/IHttpClientRequestParameters";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export class AxiosHttpClient implements IHttpClient {
  protected readonly instance: AxiosInstance;

  public constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL: baseURL,
    });

    // this._initializeResponseInterceptor();
  }

  public delete<T>(parameters: IHttpClientRequestParameters): Promise<T> {
    throw new Error("Method not implemented.");
  }

  public get<T>(parameters: IHttpClientRequestParameters): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const { url, headers } = parameters

      const options: AxiosRequestConfig = {
        headers: headers
      }

      this.instance
        .get(url, options)
        .then((response: any) => {
          resolve(response.data as T)
        })
        .catch((response: any) => {
          reject(response)
        })
    });
  }

  public post<T>(parameters: IHttpClientRequestParameters): Promise<T> {
    throw new Error("Method not implemented.");
  }

  public put<T>(parameters: IHttpClientRequestParameters): Promise<T> {
    throw new Error("Method not implemented.");
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

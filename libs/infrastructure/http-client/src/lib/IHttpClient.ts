import {IHttpClientRequestParameters} from './types/IHttpClientRequestParameters';

export interface IHttpClient {
  get<T>(parameters: IHttpClientRequestParameters): Promise<T>;
  post<T>(parameters: IHttpClientRequestParameters): Promise<T>;
  put<T>(parameters: IHttpClientRequestParameters): Promise<T>;
  patch<T>(parameters: IHttpClientRequestParameters): Promise<T>;
  delete<T>(parameters: IHttpClientRequestParameters): Promise<T>;
}

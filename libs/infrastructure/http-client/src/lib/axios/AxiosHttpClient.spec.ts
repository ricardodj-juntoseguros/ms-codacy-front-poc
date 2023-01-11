import { AxiosHttpClient } from './AxiosHttpClient';
import {IHttpClientRequestParameters} from '../types/IHttpClientRequestParameters';

describe('Axios HTTP client', () => {
  const client: AxiosHttpClient = new AxiosHttpClient(
    'https://test-url.com',
    {},
    10000,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(client.instance, 'request').mockImplementation(async () => {
      return {
        data: {
          success: true,
        },
      };
    });
    jest.spyOn(client.instance.interceptors.request, 'use');
    jest.spyOn(client.instance.interceptors.response, 'use');
  });

  it('should execute GET method accordingly', async () => {
    const headers = {
      Authorization: `Bearer any_token`,
    };

    const getParameters: IHttpClientRequestParameters = {
      url: '/get-resource',
      headers,
      params: { id: 123 },
    };

    await client.get<any>(getParameters);
    expect(client.instance.request).toHaveBeenCalledWith({
      url: '/get-resource',
      headers,
      method: 'GET',
      params: { id: 123 },
      data: undefined,
    });
  });

  it('should execute POST method accordingly', async () => {
    const headers = {
      Authorization: `Bearer any_token`,
    };

    const postParameters: IHttpClientRequestParameters = {
      url: '/post-resource',
      headers,
      payload: { id: 123, name: 'John Doe' },
    };

    await client.post<any>(postParameters);
    expect(client.instance.request).toHaveBeenCalledWith({
      url: '/post-resource',
      headers,
      method: 'POST',
      params: undefined,
      data: { id: 123, name: 'John Doe' },
    });
  });

  it('should execute PUT method accordingly', async () => {
    const headers = {
      Authorization: `Bearer any_token`,
    };

    const putParameters: IHttpClientRequestParameters = {
      url: '/put-resource',
      headers,
      payload: { id: 123, name: 'Jane Doe' },
    };

    await client.put<any>(putParameters);
    expect(client.instance.request).toHaveBeenCalledWith({
      url: '/put-resource',
      headers,
      method: 'PUT',
      params: undefined,
      data: { id: 123, name: 'Jane Doe' },
    });
  });

  it('should execute DELETE method accordingly', async () => {
    const headers = {
      Authorization: `Bearer any_token`,
    };

    const deleteParameters: IHttpClientRequestParameters = {
      url: '/delete-resource',
      headers,
      payload: { id: 123 },
    };

    await client.delete<any>(deleteParameters);
    expect(client.instance.request).toHaveBeenCalledWith({
      url: '/delete-resource',
      headers,
      method: 'DELETE',
      params: undefined,
      data: { id: 123 },
    });
  });

  it('should execute PATCH method accordingly', async () => {
    const headers = {
      Authorization: `Bearer any_token`,
    };

    const patchParameters: IHttpClientRequestParameters = {
      url: '/patch-resource',
      headers,
      payload: { id: 123, name: 'Mary Anne' },
    };

    await client.patch<any>(patchParameters);
    expect(client.instance.request).toHaveBeenCalledWith({
      url: '/patch-resource',
      headers,
      method: 'PATCH',
      params: undefined,
      data: { id: 123, name: 'Mary Anne' },
    });
  });

  it('Should add request interceptors to instance without errors', async () => {
    const mockFn = jest.fn();
    client.setRequestInterceptors(
      config => {
        mockFn(`${config.baseURL}${config.url}`);
        return config;
      },
      error => mockFn(error),
    );
    expect(client.instance.interceptors.request.use).toHaveBeenCalledTimes(1);
  });

  it('Should add response interceptors to instance without errors', async () => {
    const mockFn = jest.fn();
    client.setResponseInterceptors<any>(
      value => {
        mockFn(`The name is: ${value.data.name}`);
        return value;
      },
      error => mockFn(error),
    );
    expect(client.instance.interceptors.response.use).toHaveBeenCalledTimes(1);
  });
});

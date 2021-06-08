import { AxiosHttpClient } from './AxiosHttpClient';
import IHttpClientRequestParameters from '../types/IHttpClientRequestParameters';

interface ResponseModel {
  Title: string;
}

describe('Axios HTTP client', () => {

  it('omdbapi - should return Guardians of the Galaxy Vol. 2', async () => {
    const instance: AxiosHttpClient = new AxiosHttpClient("http://www.omdbapi.com");

    const getParameters: IHttpClientRequestParameters = {
      url: '/?apikey=562630e&i=tt3896198',
    };

    const response = await instance.get<ResponseModel>(getParameters);
    expect(response.Title).toEqual('Guardians of the Galaxy Vol. 2');
  });
});

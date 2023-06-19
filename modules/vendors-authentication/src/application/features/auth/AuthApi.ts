import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import VendorsAuthenticationBaseApi from '../VendorsAuthenticationBaseApi';
import { AuthenticationDTO } from '../../types/dto';

class AuthApi {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new VendorsAuthenticationBaseApi().getInstance();
  }

  async resetPassword(
    hash: string,
    token: string,
    password: string,
  ): Promise<AuthenticationDTO> {
    const params: IHttpClientRequestParameters = {
      url: `/api/v1/user/password`,
      payload: {
        hash,
        token,
        value: password,
      },
    };
    return await this.instance.put<AuthenticationDTO>(params);
  }

  async postAuth(login: string, password: string): Promise<AuthenticationDTO> {
    const params: IHttpClientRequestParameters = {
      url: `/api/v1/login`,
      payload: {
        username: login,
        password,
      },
    };
    return await this.instance.post<AuthenticationDTO>(params);
  }
}

const authApi = new AuthApi();
export default authApi;

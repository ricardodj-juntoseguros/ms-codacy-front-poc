import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import { VendorsAuthService } from '@services';
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

  async setUserAccessCookie(userAcessToken: AuthenticationDTO): Promise<void> {
    const cookieExpiresIn = new Date(
      new Date().getTime() +
        (userAcessToken.refresh_expires_in || userAcessToken.expires_in) * 1000,
    );

    const userType = VendorsAuthService.getUserType(
      userAcessToken.access_token,
    );

    VendorsAuthService.setUserAccessCookie(
      {
        token: userAcessToken.access_token,
        refreshToken: userAcessToken.refresh_token,
        expiresIn: userAcessToken.expires_in * 1000,
        refreshExpiresIn: userAcessToken.refresh_expires_in * 1000,
        createAt: new Date().toISOString(),
        userType,
        isMaster: VendorsAuthService.isUserMaster(userAcessToken.access_token),
      },
      cookieExpiresIn,
    );

    VendorsAuthService.redirectLogin();
  }
}

const authApi = new AuthApi();
export default authApi;

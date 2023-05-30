import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import { VendorsAuthService } from '@services';
import jwtDecode from 'jwt-decode';
import VendorsAuthenticationBaseApi from '../VendorsAuthenticationBaseApi';
import { AuthenticationDTO, UserTokenDTO } from '../../types/dto';
import { USER_TYPES } from '../../../constants/userTypes';
import { REDIRECT_PAGES_AFTER_LOGIN } from '../../../constants/redirectPagesAfterLogin';

class AuthApi {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new VendorsAuthenticationBaseApi().getInstance();
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

    const tokenData = jwtDecode<UserTokenDTO>(userAcessToken.access_token);
    let userType;
    let urlRedirect = '';

    if (tokenData.realm_access.roles.includes(USER_TYPES.policyholder)) {
      userType = USER_TYPES.policyholder;
      urlRedirect = REDIRECT_PAGES_AFTER_LOGIN.policyholder;
    }
    if (tokenData.realm_access.roles.includes(USER_TYPES.insured)) {
      userType = USER_TYPES.insured;
      urlRedirect = REDIRECT_PAGES_AFTER_LOGIN.insured;
    }
    if (tokenData.realm_access.roles.includes(USER_TYPES.broker)) {
      userType = USER_TYPES.broker;
      urlRedirect = REDIRECT_PAGES_AFTER_LOGIN.broker;
    }

    VendorsAuthService.setUserAccessCookie(
      {
        token: userAcessToken.access_token,
        refreshToken: userAcessToken.refresh_token,
        expiresIn: userAcessToken.expires_in * 1000,
        refreshExpiresIn: userAcessToken.refresh_expires_in * 1000,
        createAt: new Date().toISOString(),
        userType,
        isMaster: tokenData.realm_access.roles.includes(USER_TYPES.master),
      },
      cookieExpiresIn,
    );

    window.location.assign(urlRedirect);
  }
}

const authApi = new AuthApi();
export default authApi;

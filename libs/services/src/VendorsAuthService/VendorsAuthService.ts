/* eslint-disable camelcase */
/* eslint-disable no-console */
import Cookies from 'js-cookie';
import { addMilliseconds, isBefore } from 'date-fns';
import { AxiosHttpClient } from '@infrastructure/http-client';
import { ChatUtils } from '@shared/utils';
import jwtDecode from 'jwt-decode';
import UserToken from './types/UserToken';

export class VendorsAuthService {
  private readonly USER_ACCESS_COOKIE =
    process.env['NX_GLOBAL_VENDORS_USER_ACCESS_COOKIE'] || 'vendors_uac';

  private readonly COOKIE_DOMAIN =
    process.env['NX_GLOBAL_COOKIE_DOMAIN'] || 'juntoseguros.com';

  private readonly PLATAFORMA_BFF_URL =
    process.env['NX_GLOBAL_VENDORS_BFF_URL'] || '';

  private readonly PLATAFORMA_VENDORS_URL =
    process.env['NX_GLOBAL_VENDORS_PLATFORM_URL'] || '';

  private readonly USER_CHAT =
    process.env['NX_GLOBAL_BROKER_USER_CHAT_COOKIE'] || 'user-chat';

  private readonly USER_TYPES = {
    policyholder: 'policyholder',
    insured: 'insured',
    broker: 'broker',
    master: 'master',
  };

  private readonly REDIRECT_PAGES_AFTER_LOGIN = {
    policyholder: `${this.PLATAFORMA_VENDORS_URL}/policies`,
    insured: `${this.PLATAFORMA_VENDORS_URL}/policies`,
    broker: `${this.PLATAFORMA_VENDORS_URL}/policies`,
  };

  getUserAccessCookie() {
    const userCookie = Cookies.get(this.USER_ACCESS_COOKIE) || '';
    if (!userCookie) return null;
    return JSON.parse(userCookie);
  }

  setUserAccessCookie(
    acessToken: string,
    refreshToken: string,
    expiresIn: number,
    refreshExpiresIn: number,
  ) {
    const cookieExpiresIn = new Date(
      new Date().getTime() + (refreshExpiresIn || expiresIn) * 1000,
    );
    const tokenData = jwtDecode<UserToken>(acessToken);
    let userType;

    if (tokenData.realm_access.roles.includes(this.USER_TYPES.policyholder)) {
      userType = this.USER_TYPES.policyholder;
    }
    if (tokenData.realm_access.roles.includes(this.USER_TYPES.insured)) {
      userType = this.USER_TYPES.insured;
    }
    if (tokenData.realm_access.roles.includes(this.USER_TYPES.broker)) {
      userType = this.USER_TYPES.broker;
    }
    Cookies.set(
      this.USER_ACCESS_COOKIE,
      JSON.stringify({
        token: acessToken,
        refreshToken,
        expiresIn: expiresIn * 1000,
        refreshExpiresIn: refreshExpiresIn * 1000,
        createAt: new Date().toISOString(),
        userType,
        isMaster: tokenData.realm_access.roles.includes(this.USER_TYPES.master),
      }),
      {
        expires: cookieExpiresIn,
        domain: this.COOKIE_DOMAIN,
      },
    );
    Cookies.set(
      this.USER_CHAT,
      JSON.stringify({
        name: tokenData.name,
        email: tokenData.email || tokenData.preferred_username,
      }),
      {
        domain: this.COOKIE_DOMAIN,
      },
    );
  }

  clearAuthData() {
    ChatUtils.zenDesk.close();
    localStorage.clear();
    Cookies.remove(this.USER_ACCESS_COOKIE, { domain: this.COOKIE_DOMAIN });
    Cookies.remove(this.USER_CHAT, { domain: this.COOKIE_DOMAIN });
    window.location.assign(this.PLATAFORMA_VENDORS_URL);
  }

  doSessionLogout(accessToken: string, refreshToken: string) {
    const axiosInstance = new AxiosHttpClient(
      this.PLATAFORMA_BFF_URL,
      {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `bearer ${accessToken}`,
      },
      100000,
    );
    return axiosInstance.post({
      url: '/auth/logout',
      payload: `refreshToken=${refreshToken}`,
    });
  }

  doRefreshToken() {
    const { refreshToken } = this.getUserAccessCookie();
    const axiosInstance = new AxiosHttpClient(
      this.PLATAFORMA_BFF_URL,
      { 'Content-Type': 'application/x-www-form-urlencoded' },
      100000,
    );
    return axiosInstance.post({
      url: '/api/v1/login/refresh',
      payload: `refreshToken=${refreshToken}`,
    });
  }

  isAuthenticated(): boolean {
    const userCookie = this.getUserAccessCookie();
    if (!userCookie) return false;

    const { refreshExpiresIn, expiresIn, createAt } = userCookie;
    const tokenLifespan = refreshExpiresIn || expiresIn;
    const now = new Date();
    const expirationDate = addMilliseconds(new Date(createAt), tokenLifespan);

    return isBefore(now, expirationDate);
  }

  getUsername(): string | null {
    const userCookie = this.getUserAccessCookie();
    if (!userCookie) return null;
    const tokenData = jwtDecode<UserToken>(userCookie.token);

    const { name } = tokenData;
    return name;
  }

  getUserEmail(): string | null {
    const userCookie = this.getUserAccessCookie();
    if (!userCookie) return null;
    const tokenData = jwtDecode<UserToken>(userCookie.token);

    const { email, preferred_username } = tokenData;
    return email || preferred_username;
  }

  getRedirectPageAfterLogin(): string {
    const userCookie = this.getUserAccessCookie();
    if (!userCookie) return '';
    const { userType } = userCookie;
    let urlRedirect = '';

    switch (userType) {
      case this.USER_TYPES.policyholder:
        urlRedirect = this.REDIRECT_PAGES_AFTER_LOGIN.policyholder;
        break;
      case this.USER_TYPES.broker:
        urlRedirect = this.REDIRECT_PAGES_AFTER_LOGIN.broker;
        break;
      case this.USER_TYPES.insured:
        urlRedirect = this.REDIRECT_PAGES_AFTER_LOGIN.insured;
        break;
      default:
        return '';
    }
    return urlRedirect;
  }

  async logout() {
    const { token, refreshToken } = this.getUserAccessCookie();
    await this.doSessionLogout(token, refreshToken)
      .catch(() => console.error('Error ocurred on session token logout'))
      .finally(() => this.clearAuthData());
  }

  getUserType(): 'insured' | 'policyholder' | 'broker' | null {
    const userCookie = this.getUserAccessCookie();
    if (!userCookie) return null;
    const { userType } = userCookie;
    return userType;
  }

  // eslint-disable-next-line camelcase
  isUserMaster(access_token: string) {
    const tokenData = jwtDecode<any>(access_token);
    return tokenData.realm_access.roles.includes(this.USER_TYPES.master);
  }

  initInsuredChat() {
    const userType = this.getUserType();
    if (userType === 'insured') {
      ChatUtils.zenDesk.init();
    }
  }
}

export default new VendorsAuthService();

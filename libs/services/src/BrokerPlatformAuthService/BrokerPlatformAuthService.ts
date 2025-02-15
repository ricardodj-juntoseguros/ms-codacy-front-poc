/* eslint-disable no-console */
import Cookies from 'js-cookie';
import { addMilliseconds, isBefore } from 'date-fns';
import jwtDecode from 'jwt-decode';
import { AxiosHttpClient } from '@infrastructure/http-client';
import UserAccessToken from './types/UserAccessToken';
import { Broker } from './types/Broker';
import { ProfileEnum } from './enums/ProfileEnum';

export class BrokerPlatformAuthService {
  private readonly USER_ACCESS_COOKIE =
    process.env['NX_GLOBAL_BROKER_USER_ACCESS_COOKIE'] || 'uac';

  private readonly USER_CHAT_COOKIE =
    process.env['NX_GLOBAL_BROKER_USER_CHAT_COOKIE'] || 'user-chat';

  private readonly USER_SESSION_COOKIE =
    process.env['NX_GLOBAL_BROKER_USER_SESSION_COOKIE'] || 'userId';

  private readonly COOKIE_DOMAIN =
    process.env['NX_GLOBAL_COOKIE_DOMAIN'] || 'juntoseguros.com';

  private readonly PLATAFORMA_BFF_URL =
    process.env['NX_GLOBAL_BROKER_PLATFORM_BFF_URL'] || '';

  private readonly FIDELIZE_BROKER_FEATURES_COOKIE =
    process.env['NX_GLOBAL_FIDELIZE_BROKER_FEATURES_COOKIE'] || 'fbfc';

  private readonly FIDELIZE_BROKER_LAST_ACCESS_COOKIE =
    process.env['NX_GLOBAL_FIDELIZE_BROKER_LAST_ACCESS_COOKIE'] || 'fblac';

  getUserAccessCookie() {
    const userCookie = Cookies.get(this.USER_ACCESS_COOKIE) || '';
    if (!userCookie) return null;
    return JSON.parse(userCookie);
  }

  setUserAccessCookie(content: any, expirationDate: Date) {
    Cookies.set(this.USER_ACCESS_COOKIE, JSON.stringify(content), {
      expires: expirationDate,
      domain: this.COOKIE_DOMAIN,
    });
    Cookies.set(
      this.FIDELIZE_BROKER_FEATURES_COOKIE,
      Cookies.get(this.FIDELIZE_BROKER_FEATURES_COOKIE) || 'false',
      {
        expires: expirationDate,
        domain: this.COOKIE_DOMAIN,
      },
    );
    Cookies.set(
      this.FIDELIZE_BROKER_LAST_ACCESS_COOKIE,
      this.getFidelizeBrokerLastAccessCookie() || '',
      {
        expires: expirationDate,
        domain: this.COOKIE_DOMAIN,
      },
    );
  }

  clearAuthData() {
    const userTheme = localStorage.getItem('userTheme');
    localStorage.clear();
    userTheme && localStorage.setItem('userTheme', userTheme);
    Cookies.remove(this.USER_ACCESS_COOKIE, { domain: this.COOKIE_DOMAIN });
    Cookies.remove(this.USER_CHAT_COOKIE, { domain: this.COOKIE_DOMAIN });
    Cookies.remove(this.USER_SESSION_COOKIE, { domain: this.COOKIE_DOMAIN });
    Cookies.remove(this.FIDELIZE_BROKER_FEATURES_COOKIE, {
      domain: this.COOKIE_DOMAIN,
    });
    Cookies.remove(this.FIDELIZE_BROKER_LAST_ACCESS_COOKIE, {
      domain: this.COOKIE_DOMAIN,
    });
    window.location.assign(
      `${process.env['NX_GLOBAL_BROKER_PLATFORM_URL']}${
        userTheme ? `/${userTheme}` : ''
      }`,
    );
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
    const { refreshToken, username } = this.getUserAccessCookie();
    const axiosInstance = new AxiosHttpClient(
      this.PLATAFORMA_BFF_URL,
      { 'Content-Type': 'application/x-www-form-urlencoded' },
      100000,
    );
    return axiosInstance.post({
      url: '/auth/api/account/v1/token/refresh',
      payload: `refresh_token=${refreshToken}&username=${username}`,
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

  isBroker(): boolean {
    const userCookie = this.getUserAccessCookie();
    if (!userCookie) return false;

    const { token } = userCookie;
    const decodedToken = jwtDecode<UserAccessToken>(token);
    return decodedToken.realm_access?.roles
      ? decodedToken.realm_access.roles.includes('broker')
      : decodedToken?.loginOwnerId !== null &&
          decodedToken?.loginOwnerUserName !== null;
  }

  getBroker(): Broker | null {
    const userCookie = this.getUserAccessCookie();
    if (!userCookie) return null;

    const { broker } = userCookie;
    return broker;
  }

  getUsername(): string | null {
    const userCookie = this.getUserAccessCookie();
    if (!userCookie) return null;

    const { username } = userCookie;
    return username;
  }

  getUserType(): number | null {
    const userCookie = this.getUserAccessCookie();
    if (!userCookie) return null;

    const { broker } = userCookie;
    return broker && broker.user ? broker.user.userType : null;
  }

  getUserProfile(): ProfileEnum | null {
    let userProfile: ProfileEnum | null = null;
    const userCookie = this.getUserAccessCookie();
    if (!userCookie) return null;
    const { token } = userCookie;
    const decodedToken = jwtDecode<UserAccessToken>(token);
    const isSuperUser = decodedToken && decodedToken.loginOwnerUserName;
    const isUserBroker =
      decodedToken && decodedToken.realm_access?.roles.includes('broker');
    if (isSuperUser) {
      userProfile = ProfileEnum.COMMERCIAL;
    } else if (isUserBroker) {
      userProfile = ProfileEnum.BROKER;
    } else {
      userProfile = ProfileEnum.POLICYHOLDER;
    }
    return userProfile;
  }

  userHasPermission(permissionKey: string): boolean {
    const userCookie = this.getUserAccessCookie();
    if (!userCookie) return false;
    const { permissions } = userCookie;
    return permissions.includes(permissionKey);
  }

  async logout() {
    const { token, refreshToken } = this.getUserAccessCookie();
    await this.doSessionLogout(token, refreshToken)
      .catch(() => console.error('Error ocurred on session token logout'))
      .finally(() => this.clearAuthData());
  }

  getFidelizeBrokerLastAccessCookie() {
    const cookieData =
      Cookies.get(this.FIDELIZE_BROKER_LAST_ACCESS_COOKIE) || '';
    return cookieData || null;
  }

  setFidelizeBrokerLastAccessCookie(lastAccess: string) {
    const userCookie = this.getUserAccessCookie();
    if (userCookie !== null) {
      const { createAt, refreshExpiresIn } = userCookie;
      Cookies.set(this.FIDELIZE_BROKER_LAST_ACCESS_COOKIE, lastAccess, {
        domain: this.COOKIE_DOMAIN,
        expires: new Date(new Date(createAt).getTime() + refreshExpiresIn),
      });
    }
  }
}

export default new BrokerPlatformAuthService();

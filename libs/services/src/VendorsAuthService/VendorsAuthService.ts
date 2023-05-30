/* eslint-disable no-console */
import Cookies from 'js-cookie';
import { addMilliseconds, isBefore } from 'date-fns';
import { AxiosHttpClient } from '@infrastructure/http-client';

export class VendorsAuthService {
  private readonly USER_ACCESS_COOKIE =
    process.env['NX_GLOBAL_VENDORS_USER_ACCESS_COOKIE'] || 'vendors_uac';

  private readonly COOKIE_DOMAIN =
    process.env['NX_GLOBAL_COOKIE_DOMAIN'] || 'juntoseguros.com';

  private readonly PLATAFORMA_BFF_URL =
    process.env['NX_GLOBAL_VENDORS_BFF_URL'] || '';

  private readonly PLATAFORMA_VENDORS_URL =
    process.env['NX_GLOBAL_VENDORS_BFF_URL'] || '';

  getUserAccessCookie() {
    const userCookie = Cookies.get(this.USER_ACCESS_COOKIE) || '';
    if (!userCookie) return null;
    return JSON.parse(userCookie);
  }

  setUserAccessCookie(content: any, expirationDate: Date) {
    Cookies.set(this.USER_ACCESS_COOKIE, JSON.stringify(content), {
      expires: expirationDate,
      path: this.COOKIE_DOMAIN,
    });
  }

  clearAuthData() {
    localStorage.clear();
    Cookies.remove(this.USER_ACCESS_COOKIE, { domain: this.COOKIE_DOMAIN });
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

  getUsername(): string | null {
    const userCookie = this.getUserAccessCookie();
    if (!userCookie) return null;

    const { username } = userCookie;
    return username;
  }

  async logout() {
    const { token, refreshToken } = this.getUserAccessCookie();
    await this.doSessionLogout(token, refreshToken)
      .catch(() => console.error('Error ocurred on session token logout'))
      .finally(() => this.clearAuthData());
  }
}

export default new VendorsAuthService();

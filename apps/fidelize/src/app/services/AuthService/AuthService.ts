import Cookies from 'js-cookie';
import { addMilliseconds, isBefore } from 'date-fns';
import jwtDecode from 'jwt-decode';
import UserAccessToken from '../types/UserAccessToken';

class AuthService {
  private readonly USER_ACCESS_COOKIE =
    process.env.NX_FID_USER_ACCESS_COOKIE || 'uac';

  isAuthenticated(): boolean {
    const userCookie = Cookies.get(this.USER_ACCESS_COOKIE) || '';
    if (!userCookie) return false;

    const { refreshExpiresIn, expiresIn, createAt } = JSON.parse(userCookie);
    const tokenLifespan = refreshExpiresIn || expiresIn;
    const now = new Date();
    const expirationDate = addMilliseconds(new Date(createAt), tokenLifespan);

    return isBefore(now, expirationDate);
  }

  isBroker(): boolean {
    const userCookie = Cookies.get(this.USER_ACCESS_COOKIE) || '';
    if (!userCookie) return false;

    const { token } = JSON.parse(userCookie);
    const decodedToken = jwtDecode<UserAccessToken>(token);
    return decodedToken.realm_access.roles.includes('broker');
  }
}

export default new AuthService();

import { isAfter } from 'date-fns';
import jwtDecode from 'jwt-decode';
import { User } from './types/User';
import UserToken from './types/UserToken';

export class BackofficeAuthService {
  private readonly TOKEN_KEY =
    process.env['NX_GLOBAL_BACKOFFICE_TOKEN_KEY'] || 'token';

  private readonly USER_KEY =
    process.env['NX_GLOBAL_BACKOFFICE_USER_KEY'] || 'user';

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return false;
    try {
      const tokenData = jwtDecode<UserToken>(token);
      const expiry = tokenData.exp;
      if (!expiry) return false;
      const expiresDate = new Date(expiry * 1000);
      const now = new Date();
      if (isAfter(now, expiresDate)) {
        this.clearAuthData();
        return false;
      }
      return true;
    } catch (error: any) {
      return false;
    }
  }

  clearAuthData() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  private getUserData(): User | null {
    const user = localStorage.getItem(this.USER_KEY);
    if (!user) return null;
    try {
      const userData: User = JSON.parse(user);
      return userData;
    } catch {
      return null;
    }
  }

  getUserName(): string | null {
    const user = this.getUserData();
    return user !== null ? user.name : null;
  }

  getUserRole(): string | null {
    const user = this.getUserData();
    return user !== null ? user.role : null;
  }

  getUserIsViewer(): boolean {
    const user = this.getUserData();
    return user !== null ? user.isViewer : false;
  }
}

export default new BackofficeAuthService();

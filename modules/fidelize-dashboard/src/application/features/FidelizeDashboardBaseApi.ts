import Cookies from 'js-cookie';
import { AxiosHttpClient } from '@infrastructure/http-client';

class FidelizeDashboardBaseApi {
  private readonly BASE_URL = `${process.env.NX_GLOBAL_FIDELIZE_BFF_URL}/api`;

  private readonly USER_ACCESS_COOKIE =
    process.env.NX_GLOBAL_BROKER_USER_ACCESS_COOKIE || 'uac';

  private headers = {};

  private timeout = 1000000;

  public constructor() {
    this.headers = {
      authorization: this.getAuthorizationHeader(),
    };
  }

  public getInstance(): AxiosHttpClient {
    return new AxiosHttpClient(this.BASE_URL, this.headers, this.timeout);
  }

  private getAuthorizationHeader(): string {
    const userCookie = Cookies.get(this.USER_ACCESS_COOKIE) || '';
    if (!userCookie) return '';
    const { token } = JSON.parse(userCookie);
    return `Bearer ${token}`;
  }

  public getHeaders() {
    return this.headers;
  }
}

export default FidelizeDashboardBaseApi;

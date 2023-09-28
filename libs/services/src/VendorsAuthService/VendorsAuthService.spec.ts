import { AxiosHttpClient } from '@infrastructure/http-client';
import Cookies from 'js-cookie';
import { ChatUtils } from '@shared/utils';
import VendorsAuthService from './VendorsAuthService';
import { UserTypeEnum } from './enums';

const mockToken =
  'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJzMF82cUlyUGdXMkFOWHo5YjZreXc2YnAzNUpPR2QtcEZBNDdjWFFHT2g0In0.eyJleHAiOjE2ODY4NTQyNzksImlhdCI6MTY4Njg1MzM3OSwianRpIjoiZjQ1Y2RjNzUtYjZlNi00NGQ1LTk3MmYtMmU4MjgyMmExNTFhIiwiaXNzIjoiaHR0cHM6Ly9nYXRla2VlcGVyLXFhcy5qdW50b3NlZ3Vyb3MuY29tL2F1dGgvcmVhbG1zL3NlZ3VyYWRvcmFfdmVuZG9ycyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJhZTI3MzUzNy1iN2FlLTQwYzQtYmIxNy0xYTc5MjE3N2UzODMiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJ2ZW5kb3JzX3BsYXRmb3JtIiwic2Vzc2lvbl9zdGF0ZSI6Ijk4OWE5YTQ1LTVhOGEtNDY5My04OTY4LTBhZjQzMDYwY2FlMSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cHM6Ly9qdW50b3NlZ3Vyb3MucG9zdG1hbi5jby8qIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJpbnN1cmVkIiwiZGVmYXVsdC1yb2xlcy1zZWd1cmFkb3JhX3ZlbmRvcnMiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwibmFtZSI6IkFETSBCUksiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhZG1fYnJrQGJyay5jb20uYnIiLCJnaXZlbl9uYW1lIjoiQURNIiwiZmFtaWx5X25hbWUiOiJCUksiLCJlbWFpbCI6ImFkbV9icmtAYnJrLmNvbS5iciJ9.fRAv4qQWJbvjF9acT__Jf7KoR5LuXVIClKQ1h-HU0FogKQgC8bL9PssWFZKoILHBOheXjo5-MsF31r92g0ek8Cz7DzJaE7ICB4I_VV5yEmBzeyf6xDmrTbM-BJ7jSpgGPLPDaW2LBMvR_M7bi362PXyTxbNagDAHpzciRbVCGyWqf19v-NTuD9G5OgQSdcqyxTKJw_XEmvnDdQbJwDUFpx64LSeKjMViHkgo5QffGq2tet411D6D2eFhEtqbvFsewf5rh2uTT6M6AxiQz0z4dl7wUzBNY2HohuJ8CW_Y-WdEPRUSUT1qMLm66Xv4gAGOP03BWz7C6tFZuXsswRzL9Q';
const mockInsuredCookie = `{"token": "${mockToken}", "refreshToken": "refresh-token", "refreshExpiresIn": 1800000, "expiresIn": 900000, "createAt": "${new Date().toISOString()}", "userType": "insured", "isMaster": false}`;
const mockBrokerCookie = `{"token": "${mockToken}", "refreshToken": "refresh-token", "refreshExpiresIn": 1800000, "expiresIn": 900000, "createAt": "${new Date().toISOString()}", "userType": "broker", "isMaster": false}`;
const mockPolicyholderCookie = `{"token": "${mockToken}", "refreshToken": "refresh-token", "refreshExpiresIn": 1800000, "expiresIn": 900000, "createAt": "${new Date().toISOString()}", "userType": "policyholder", "isMaster": false}`;

describe('Vendors Auth Service', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { assign: jest.fn() },
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('setUserAccessCookie should set cookie with correct data', () => {
    jest.spyOn(Cookies, 'set').mockReturnValue(mockInsuredCookie as any);

    VendorsAuthService.setUserAccessCookie(
      mockToken,
      'any_refresh_token',
      900,
      1800,
    );
    expect(Cookies.set).toHaveBeenCalledWith(
      'vendors_uac',
      expect.stringMatching('token'),
      expect.objectContaining({
        expires: expect.anything(),
        domain: expect.anything(),
      }),
    );
  });

  it('isAuthenticated should read user cookie and validate token lifespan', () => {
    jest.spyOn(Cookies, 'get').mockReturnValue(mockInsuredCookie as any);

    const result = VendorsAuthService.isAuthenticated();
    expect(result).toBeTruthy();
  });

  it('isAuthenticated should return false if user cookie is not present', () => {
    jest.spyOn(Cookies, 'get').mockReturnValue(undefined as any);

    const result = VendorsAuthService.isAuthenticated();
    expect(result).toBeFalsy();
  });

  it('getUsername should read token on user cookie and return username', () => {
    jest.spyOn(Cookies, 'get').mockReturnValue(mockInsuredCookie as any);

    const result = VendorsAuthService.getUsername();
    expect(result).toBe('ADM BRK');
  });

  it('getUserEmail should read token on user cookie and return user email', () => {
    jest.spyOn(Cookies, 'get').mockReturnValue(mockInsuredCookie as any);

    const result = VendorsAuthService.getUserEmail();
    expect(result).toBe('adm_brk@brk.com.br');
  });

  it('getUsername should return null if user cookie is not present', () => {
    jest.spyOn(Cookies, 'get').mockReturnValue(undefined as any);

    const result = VendorsAuthService.getUsername();
    expect(result).toBe(null);
  });

  it('logout should call platform bff, clear cookies and localstorage and redirect to broker platform', async () => {
    jest.spyOn(Cookies, 'get').mockReturnValue(mockInsuredCookie as any);
    const cookiesMock = jest.spyOn(Cookies, 'remove');
    const storageMock = jest.spyOn(Storage.prototype, 'clear');
    jest
      .spyOn(VendorsAuthService, 'doSessionLogout')
      .mockImplementationOnce(async () => {
        'OK';
      });

    await VendorsAuthService.logout();
    expect(VendorsAuthService.doSessionLogout).toHaveBeenCalledWith(
      mockToken,
      'refresh-token',
    );
    expect(cookiesMock).toHaveBeenCalledTimes(2);
    expect(storageMock).toHaveBeenCalledTimes(1);
  });

  it('doSessionLogout should call platform bff correctly', async () => {
    const axiosMock = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => {
        return 'OK';
      });
    jest.spyOn(Cookies, 'get').mockReturnValue(mockInsuredCookie as any);

    await VendorsAuthService.doSessionLogout('access_token', 'refresh_token');
    expect(axiosMock).toHaveBeenCalledWith({
      url: '/auth/logout',
      payload: 'refreshToken=refresh_token',
    });
  });

  it('doRefreshToken should call platform bff correctly', async () => {
    const axiosMock = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => {
        return { refresh_token: 'refresh_token' };
      });
    jest.spyOn(Cookies, 'get').mockReturnValue(mockInsuredCookie as any);

    await VendorsAuthService.doRefreshToken();
    expect(axiosMock).toHaveBeenCalledWith({
      url: '/api/v1/login/refresh',
      payload: 'refreshToken=refresh-token',
    });
  });

  /* it('getRedirectPageAfterLogin should read userType from user cookie and return correct url for type insured', () => {
    window.location.href = '';
    jest.spyOn(Cookies, 'get').mockReturnValue(mockInsuredCookie as any);
    const url = VendorsAuthService.getRedirectPageAfterLogin();
    expect(url).toMatch(/\/policies/i);
  });

  it('getRedirectPageAfterLogin should read userType from user cookie and return correct url for type policyholder', () => {
    jest.spyOn(Cookies, 'get').mockReturnValue(mockPolicyholderCookie as any);
    const url = VendorsAuthService.getRedirectPageAfterLogin();
    expect(url).toMatch(/\policies/i);
  });

  it('getRedirectPageAfterLogin should read userType from user cookie and return correct url for type broker', () => {
    jest.spyOn(Cookies, 'get').mockReturnValue(mockBrokerCookie as any);
    const url = VendorsAuthService.getRedirectPageAfterLogin();
    expect(url).toMatch(/\policies/i);
  }); */

  it('initInsuredChat should only open chat if logged user type is insured', () => {
    jest
      .spyOn(VendorsAuthService, 'getUserType')
      .mockImplementationOnce(() => UserTypeEnum.INSURED)
      .mockImplementationOnce(() => UserTypeEnum.POLICYHOLDER);
    jest.spyOn(ChatUtils.zenDesk, 'init');

    VendorsAuthService.initInsuredChat();
    expect(ChatUtils.zenDesk.init).toHaveBeenCalledTimes(1);
    VendorsAuthService.initInsuredChat();
    expect(ChatUtils.zenDesk.init).toHaveBeenCalledTimes(1);
  });
});

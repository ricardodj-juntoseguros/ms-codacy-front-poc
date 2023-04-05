import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import BackofficeAuthService from './BackofficeAuthService';

const mockToken =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IjY4NEEyNEU2MEEzNDFGN0UyN0FEMEY0RjYzREI4NDBFOUFERDZBNjIiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJhRW9rNWdvMEgzNG5yUTlQWTl1RURwcmRhbUkifQ.eyJuYmYiOjE2Nzc1Mjk3NzEsImV4cCI6MTY3NzU3Mjk3MSwiaXNzIjoiaHR0cHM6Ly9tcy1nYXRld2F5LXFhcy5qdW50b3NlZ3Vyb3MuY29tL3NxdWFkNi9hdXRoIiwiYXVkIjpbImh0dHBzOi8vbXMtZ2F0ZXdheS1xYXMuanVudG9zZWd1cm9zLmNvbS9zcXVhZDYvYXV0aC9yZXNvdXJjZXMiLCJiYWNrb2ZmaWNlIiwidXNlcnMiXSwiY2xpZW50X2lkIjoiUGxhdGFmb3JtYUJhY2tvZmZpY2UiLCJzdWIiOiJwYWluZWxfYmFja29mZmljZV9xYSIsImF1dGhfdGltZSI6MTY3NzUyOTc3MSwiaWRwIjoibG9jYWwiLCJVc2VySWQiOiIxNTg0OCIsIlR5cGUiOiIxIiwiVXNlclR5cGUiOiJQb2xpY3lob2xkZXIiLCJuYW1lIjoicGFpbmVsX2JhY2tvZmZpY2VfcWEiLCJpc1N1c2VwVmFsaWRhdGVkIjoiRmFsc2UiLCJwZXJtaXNzaW9ucy5zdWJkZXBhcnRtZW50IjpbInJqIiwicHIiLCJzcCIsImFtIiwiYmEiLCJjZSIsImRmIiwiZXMiLCJwYSIsIm1nIiwicGUiLCJycyIsInNjIl0sImlkIjoiNmVkMDU5ZjQtOTBlNC00MjA4LThlYzAtOGNkM2I2OTI1ODYwIiwicm9sZSI6ImNvbW1lcmNpYWwiLCJzY29wZSI6WyJiYWNrb2ZmaWNlIiwidXNlcnMiXSwiYW1yIjpbInB3ZCJdfQ.k0x14UMptDwyZYS9gFj4fZA41KCuzeZFjgiKoVs9LkIMaOhWMRxJxJyq-9-AezsPMo6Y_3IHQr4UYSYLWVWBYFtsVxi8MSN5wlnkAJ58U8Fy1Z3vH23P6TAMbJYkgvpjcvs7F0IENkJVkEPKV46fuAP6h6ofjfKbqLHr0Qce_TNLpoc6AsCE_E541fRoGksQ89sDcPFGNHKVDt9epsD0Tsa7koKtAj2n54Q17ys51Ue1vAc5B1fb5KPZfZmj3_4pqmxSXKCABboDJ12CGUY5dn2E3fxuUdhrwUylaONM3AhOwHqARV9WooPKjs4JotTTMkcGcCZ2Nf7UHlJdnhO69A';
const mockTokenData = {
  nbf: 1677529771,
  exp: (new Date().getTime() + 3600000) / 1000,
  iss: 'https://ms-gateway-qas.juntoseguros.com/squad2/auth',
  aud: [
    'https://ms-gateway-qas.juntoseguros.com/squad2/auth/resources',
    'backoffice',
    'users',
  ],
  client_id: 'PlataformaBackoffice',
  sub: 'painel_backoffice_qa',
  auth_time: 1677529771,
  idp: 'local',
  UserId: '15848',
  Type: '1',
  UserType: 'Policyholder',
  name: 'painel_backoffice_qa',
  isSusepValidated: 'False',
  'permissions.subdepartment': ['pr', 'sp'],
  id: '6ed059f4-90e4-4208-8ec0-8cd3b6925860',
  role: 'commercial',
  scope: ['backoffice', 'users'],
  amr: ['pwd'],
};
const mockTokenDataExpired = {
  nbf: 1677529771,
  exp: (new Date().getTime() - 3600000) / 1000,
  iss: 'https://ms-gateway-qas.juntoseguros.com/squad2/auth',
  aud: [
    'https://ms-gateway-qas.juntoseguros.com/squad2/auth/resources',
    'backoffice',
    'users',
  ],
  client_id: 'PlataformaBackoffice',
  sub: 'painel_backoffice_qa',
  auth_time: 1677529771,
  idp: 'local',
  UserId: '15848',
  Type: '1',
  UserType: 'Policyholder',
  name: 'painel_backoffice_qa',
  isSusepValidated: 'False',
  'permissions.subdepartment': ['pr', 'sp'],
  id: '6ed059f4-90e4-4208-8ec0-8cd3b6925860',
  role: 'commercial',
  scope: ['backoffice', 'users'],
  amr: ['pwd'],
};

const mockUserData = `{"name": "painel_backoffice_qa","role": "commercial", "isViewer": true, "hasOpportunityRequest": true}`;
jest.mock('jwt-decode', () => jest.fn());

describe('Backoffice Auth Service', () => {
  beforeAll(() => {
    const localStorageMock = (function () {
      let store: any = {};
      return {
        getItem(key: string) {
          return store[key];
        },
        setItem(key: string, value: any) {
          store[key] = value;
        },
        clear() {
          store = {};
        },
        removeItem(key: string) {
          delete store[key];
        },
        getAll() {
          return store;
        },
      };
    })();

    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  it('isAuthenticated should read localstorage to retrieve user token and return true if not expired', () => {
    (jwtDecode as jest.Mock).mockImplementationOnce(() => mockTokenData);
    window.localStorage.setItem('token', mockToken);
    const result = BackofficeAuthService.isAuthenticated();
    expect(result).toBeTruthy();
  });

  it('isAuthenticated should read localstorage to retrieve user token and return false if expired', () => {
    window.localStorage.setItem('token', mockToken);
    (jwtDecode as jest.Mock).mockImplementationOnce(() => mockTokenDataExpired);
    const result = BackofficeAuthService.isAuthenticated();
    expect(result).toBeFalsy();
  });

  it('isAuthenticated should return false if user token is not present', () => {
    window.localStorage.removeItem('token');
    const result = BackofficeAuthService.isAuthenticated();
    expect(result).toBeFalsy();
  });

  it('clearAuthData should clear user data from localstorage', () => {
    window.localStorage.setItem('token', 'any_token');
    window.localStorage.setItem('user', 'any_user_data');
    BackofficeAuthService.clearAuthData();
    expect(window.localStorage.getItem('token')).toBeUndefined();
    expect(window.localStorage.getItem('user')).toBeUndefined();
  });

  it('getUserName should read user data on storage and return username', () => {
    window.localStorage.setItem('user', mockUserData);
    const result = BackofficeAuthService.getUserName();
    expect(result).toBe('painel_backoffice_qa');
  });

  it('getUsername should return null if user user data is not present', () => {
    const result = BackofficeAuthService.getUserName();
    expect(result).toBeNull();
  });

  it('getUserRole should read user data on storage and return user role', async () => {
    window.localStorage.setItem('user', mockUserData);
    const result = BackofficeAuthService.getUserRole();
    expect(result).toBe('commercial');
  });

  it('getUserRole should return null if user user data is not present', async () => {
    const result = BackofficeAuthService.getUserRole();
    expect(result).toBeNull();
  });

  it('getUserIsViewer should read user data on storage and return if user is viewer', async () => {
    window.localStorage.setItem('user', mockUserData);
    const result = BackofficeAuthService.getUserIsViewer();
    expect(result).toBeTruthy();
  });

  it('getUserIsViewer should return false if user data on storage is not present', async () => {
    const result = BackofficeAuthService.getUserIsViewer();
    expect(result).toBeFalsy();
  });

  it('getUserHasOpportunityRequest should read user data on storage and return if user hasOpportunityRequest access', async () => {
    window.localStorage.setItem('user', mockUserData);
    const result = BackofficeAuthService.getUserHasOpportunityRequest();
    expect(result).toBeTruthy();
  });

  it('getUserHasOpportunityRequest should return false if user data on storage is not present', async () => {
    const result = BackofficeAuthService.getUserHasOpportunityRequest();
    expect(result).toBeFalsy();
  });

  it('saveTokenAndUserFromAccessCookie should read backoffice access cookie and save token and user to localstorage', () => {
    const cookiesMock = jest
      .spyOn(Cookies, 'get')
      .mockReturnValue(
        '{"token":"test_token","user":{"name":"test_user","role":"commercial","isViewer":false}}' as any,
      );
    BackofficeAuthService.saveTokenAndUserFromAccessCookie();
    expect(cookiesMock).toHaveBeenCalledWith('bac');
    expect(window.localStorage.getItem('token')).toBe('test_token');
    expect(window.localStorage.getItem('user')).toBe(
      '{"name":"test_user","role":"commercial","isViewer":false}',
    );
  });
});

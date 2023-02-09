import { AxiosHttpClient } from '@infrastructure/http-client';
import Cookies from 'js-cookie';
import BrokerPlatformAuthService from './BrokerPlatformAuthService';

const mockToken =
  'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJueEt6aHhlR285amoyZzQwYWZmeVlDYlQybjJwTVVfQmdBQXNUb0EzZVFJIn0.eyJleHAiOjE2NDM5MDAyMjEsImlhdCI6MTY0Mzg5OTMyMSwianRpIjoiMjA2NmQzNmUtOWQ3Ny00NjFkLWE5NWEtNWJjYzFlZjZjODc3IiwiaXNzIjoiaHR0cHM6Ly9nYXRla2VlcGVyLXFhcy5qdW50b3NlZ3Vyb3MuY29tL2F1dGgvcmVhbG1zL3NlZ3VyYWRvcmFfYmV4IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6ImM3YzFkZTNlLTZmN2EtNDlhNy1iNTJmLWQ0NWVkZGY5MDM5MSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImJyb2tlcl9wbGF0Zm9ybSIsInNlc3Npb25fc3RhdGUiOiIxNzU5ZmMwOC02M2JkLTQ5ZDAtOGYxNi02Mjc3NDQ1NzVjMDMiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vanVudG9zZWd1cm9zLnBvc3RtYW4uY28vKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy1zZWd1cmFkb3JhX2JleCIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJicm9rZXIiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJnMXAxX2NvciIsInByZWZlcnJlZF91c2VybmFtZSI6ImcxcDFfY29yIiwiZ2l2ZW5fbmFtZSI6ImcxcDFfY29yIiwiZW1haWwiOiJiZXhAanVudG9zZWd1cm9zLmNvbSJ9.gCTYHFUNv6kg8kTuSSoBxlTlJy43TuqrtET6oqjgv7e50XcXBSZ5U2LoYwGVZo_ssIsw8wieN2y2k548BeOu1w22Bfn4vSSprncDte0k3raVejZyV54oLWN1g3KOkIL8IKschTd1_9AnNvU4NKskx_HouD7miEXUhO3Ca2SZ1q8QT4UWtWFnlpsbOJqZ5J22UOaqhLkzABjpmn2hvYn4X-Wy-3AI2umKfXALZ3b-4HHRKNSHLhmoRkqvYHCy0gboFo0X1eC1SRv6eKypDVMbY41J3j1j-_ToiKkDeUoPNtZ7tOVUkIpaVPsKbhjVMPpn1_VjiXmFxv2HNheAtK1bQQ';
const mockCookie = `{"token": "${mockToken}", "refreshToken": "refresh-token", "refreshExpiresIn": 1800000, "expiresIn": 900000, "createAt": "${new Date().toISOString()}", "username": "test-user"}`;

describe('Broker Platform Auth Service', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { assign: jest.fn() },
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('isAuthenticated should read user cookie and validate token lifespan', () => {
    jest.spyOn(Cookies, 'get').mockReturnValue(mockCookie as any);

    const result = BrokerPlatformAuthService.isAuthenticated();
    expect(result).toBeTruthy();
  });

  it('isAuthenticated should return false if user cookie is not present', () => {
    jest.spyOn(Cookies, 'get').mockReturnValue(undefined as any);

    const result = BrokerPlatformAuthService.isAuthenticated();
    expect(result).toBeFalsy();
  });

  it('isBroker should read user cookie and validate if token realm roles array contains broker', () => {
    jest.spyOn(Cookies, 'get').mockReturnValue(mockCookie as any);
    const result = BrokerPlatformAuthService.isBroker();
    expect(result).toBeTruthy();
  });

  it('isBroker should return false if user cookie is not present', () => {
    jest.spyOn(Cookies, 'get').mockReturnValue(undefined as any);

    const result = BrokerPlatformAuthService.isBroker();
    expect(result).toBeFalsy();
  });

  it('getUsername should read user cookie and return username', () => {
    jest.spyOn(Cookies, 'get').mockReturnValue(mockCookie as any);

    const result = BrokerPlatformAuthService.getUsername();
    expect(result).toBe('test-user');
  });

  it('getUsername should return null if user cookie is not present', () => {
    jest.spyOn(Cookies, 'get').mockReturnValue(undefined as any);

    const result = BrokerPlatformAuthService.getUsername();
    expect(result).toBe(null);
  });

  it('logout should call platform bff, clear cookies and localstorage and redirect to broker platform', async () => {
    jest.spyOn(Cookies, 'get').mockReturnValue(mockCookie as any);
    const cookiesMock = jest.spyOn(Cookies, 'remove');
    const storageMock = jest.spyOn(Storage.prototype, 'clear');
    jest
      .spyOn(BrokerPlatformAuthService, 'doSessionLogout')
      .mockImplementationOnce(async () => {
        'OK';
      });

    await BrokerPlatformAuthService.logout();
    expect(BrokerPlatformAuthService.doSessionLogout).toHaveBeenCalledWith(
      mockToken,
      'refresh-token',
    );
    expect(cookiesMock).toHaveBeenCalledTimes(5);
    expect(storageMock).toHaveBeenCalledTimes(1);
  });

  it('doSessionLogout should call platform bff correctly', async () => {
    const axiosMock = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => {
        return 'OK';
      });
    jest.spyOn(Cookies, 'get').mockReturnValue(mockCookie as any);

    await BrokerPlatformAuthService.doSessionLogout(
      'access_token',
      'refresh_token',
    );
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
    jest.spyOn(Cookies, 'get').mockReturnValue(mockCookie as any);

    await BrokerPlatformAuthService.doRefreshToken();
    expect(axiosMock).toHaveBeenCalledWith({
      url: '/auth/api/account/v1/token/refresh',
      payload: 'refresh_token=refresh-token&username=test-user',
    });
  });

  it('getFidelizeBrokerLastAccessCookie should read cookie correctly', () => {
    jest
      .spyOn(Cookies, 'get')
      .mockReturnValue('2023-01-01T16:00:00.000Z' as any);
    const result =
      BrokerPlatformAuthService.getFidelizeBrokerLastAccessCookie();
    expect(result).toBe('2023-01-01T16:00:00.000Z');
  });

  it('setFidelizeBrokerLastAccessCookie should read user cookie to get expiresIn and save correctly', () => {
    jest.spyOn(Cookies, 'get').mockReturnValue(mockCookie as any);
    jest.spyOn(BrokerPlatformAuthService, 'getUserAccessCookie');
    const cookieSetMock = jest.spyOn(Cookies, 'set');
    BrokerPlatformAuthService.setFidelizeBrokerLastAccessCookie(
      '2023-01-01T16:00:00.000Z',
    );
    expect(BrokerPlatformAuthService.getUserAccessCookie).toHaveBeenCalledTimes(
      1,
    );
    expect(cookieSetMock).toHaveBeenCalledTimes(1);
  });
});

import { AxiosHttpClient } from '@infrastructure/http-client';
import Cookies from 'js-cookie';
import BrokerPlatformAuthService from './BrokerPlatformAuthService';
import { ProfileEnum } from './enums/ProfileEnum';

const mockToken =
  'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJueEt6aHhlR285amoyZzQwYWZmeVlDYlQybjJwTVVfQmdBQXNUb0EzZVFJIn0.eyJleHAiOjE2NDM5MDAyMjEsImlhdCI6MTY0Mzg5OTMyMSwianRpIjoiMjA2NmQzNmUtOWQ3Ny00NjFkLWE5NWEtNWJjYzFlZjZjODc3IiwiaXNzIjoiaHR0cHM6Ly9nYXRla2VlcGVyLXFhcy5qdW50b3NlZ3Vyb3MuY29tL2F1dGgvcmVhbG1zL3NlZ3VyYWRvcmFfYmV4IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6ImM3YzFkZTNlLTZmN2EtNDlhNy1iNTJmLWQ0NWVkZGY5MDM5MSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImJyb2tlcl9wbGF0Zm9ybSIsInNlc3Npb25fc3RhdGUiOiIxNzU5ZmMwOC02M2JkLTQ5ZDAtOGYxNi02Mjc3NDQ1NzVjMDMiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vanVudG9zZWd1cm9zLnBvc3RtYW4uY28vKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy1zZWd1cmFkb3JhX2JleCIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJicm9rZXIiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJnMXAxX2NvciIsInByZWZlcnJlZF91c2VybmFtZSI6ImcxcDFfY29yIiwiZ2l2ZW5fbmFtZSI6ImcxcDFfY29yIiwiZW1haWwiOiJiZXhAanVudG9zZWd1cm9zLmNvbSJ9.gCTYHFUNv6kg8kTuSSoBxlTlJy43TuqrtET6oqjgv7e50XcXBSZ5U2LoYwGVZo_ssIsw8wieN2y2k548BeOu1w22Bfn4vSSprncDte0k3raVejZyV54oLWN1g3KOkIL8IKschTd1_9AnNvU4NKskx_HouD7miEXUhO3Ca2SZ1q8QT4UWtWFnlpsbOJqZ5J22UOaqhLkzABjpmn2hvYn4X-Wy-3AI2umKfXALZ3b-4HHRKNSHLhmoRkqvYHCy0gboFo0X1eC1SRv6eKypDVMbY41J3j1j-_ToiKkDeUoPNtZ7tOVUkIpaVPsKbhjVMPpn1_VjiXmFxv2HNheAtK1bQQ';
const mockCommercialToken =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IjY4NEEyNEU2MEEzNDFGN0UyN0FEMEY0RjYzREI4NDBFOUFERDZBNjIiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJhRW9rNWdvMEgzNG5yUTlQWTl1RURwcmRhbUkifQ.eyJuYmYiOjE3MDgwMDQ2NDEsImV4cCI6MTcwODAwNjQ0MSwiaXNzIjoiaHR0cHM6Ly9tcy1nYXRld2F5LXFhcy5qdW50b3NlZ3Vyb3MuY29tL3NxdWFkMS9hdXRoIiwiYXVkIjpbImh0dHBzOi8vbXMtZ2F0ZXdheS1xYXMuanVudG9zZWd1cm9zLmNvbS9zcXVhZDEvYXV0aC9yZXNvdXJjZXMiLCJhcGktcGxhdGFmb3JtYSIsInVzZXJzIl0sImNsaWVudF9pZCI6IlBsYXRhZm9ybWFBUEkiLCJzdWIiOiJ0ZXN0ZWNvcnJldG9yX2NvciIsImF1dGhfdGltZSI6MTcwODAwNDY0MSwiaWRwIjoibG9jYWwiLCJVc2VySWQiOiIxIiwiVHlwZSI6IjAiLCJVc2VyVHlwZSI6IkJyb2tlciIsIm5hbWUiOiJ0ZXN0ZWNvcnJldG9yX2NvciIsImlzU3VzZXBWYWxpZGF0ZWQiOiJUcnVlIiwiQnJva2VySWQiOiIxIiwiZW1haWwiOiJ0aV9ob21vbG9nYWNhb0BqdW50b3NlZ3Vyb3MuY29tIiwibW9kYWxpdGllcy5wb2xpY3lob2xkZXIiOlsicGVybWlzc2lvbi5wb2xpY3lob2xkZXIubW9kYWxpdHkucGVyZm9ybWFuY2UuYm9uZC5zZXJ2aWNlcy5wcm92aWRlciIsInBlcm1pc3Npb24ucG9saWN5aG9sZGVyLm1vZGFsaXR5Lmp1ZGljaWFsLmFwcGVhbCIsInBlcm1pc3Npb24ucG9saWN5aG9sZGVyLm1vZGFsaXR5Lmp1ZGljaWFsLmNpdmlsIiwicGVybWlzc2lvbi5wb2xpY3lob2xkZXIubW9kYWxpdHkuanVkaWNpYWwubGFib3IiLCJwZXJtaXNzaW9uLnBvbGljeWhvbGRlci5tb2RhbGl0eS5iaWQuYm9uZCJdLCJwZXJtaXNzaW9ucy5wb2xpY3lob2xkZXIiOlsicGVybWlzc2lvbi5wb2xpY3lob2xkZXIuaXNzdWUiLCJwZXJtaXNzaW9uLnBvbGljeWhvbGRlci5yZXBvcnRzIl0sImlkIjoiMDJmM2MwMjYtNjlkYi00MDViLTgzMGEtY2NhNmQzOThiZGIxIiwicm9sZSI6ImJyb2tlciIsIkVtYWlsVmVyaWZpZWQiOiJUcnVlIiwiRXh0ZXJuYWxHdklkIjoiMCIsImxvZ2luT3duZXJJZCI6IjE1ODQ4IiwibG9naW5Pd25lclVzZXJOYW1lIjoicGFpbmVsX2JhY2tvZmZpY2VfcWEiLCJzY29wZSI6WyJvcGVuaWQiLCJhcGktcGxhdGFmb3JtYSIsInVzZXJzIiwib2ZmbGluZV9hY2Nlc3MiXSwiYW1yIjpbInB3ZCJdfQ.mrq5vJ0owkqWXT7KZyXjsfc661CLUiDe_ZPdsvoh1nmzqHHeodN--uADNCCCiKASKoX3LEfnaMUruBCX9PhG_qufEqKDsShV4UtfFfIHipjqPMbqTBJNGlxXrJoE_RgQd0vzvtxt9PHTZe2gnyufl4lNkzI_Qjiw21cYEA6KnDf_Z-We1faBgbFbJNsERwBQrOnIeYpYIHMTf8iYbBsY4Mb1A62zoLmU6qryfV6vHz-wazI9IkL6xPAWq6tulfUJg9sCgvtiRY3zP6tipZM6i_4py8bAYTwTz-BMeqSw2jxAzhoGgAyAmUp4p0llj-oai9G1zT2e1UhVlP2KTXDw3w';
const mockPolicyholderToken =
  'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJueEt6aHhlR285amoyZzQwYWZmeVlDYlQybjJwTVVfQmdBQXNUb0EzZVFJIn0.eyJleHAiOjE3MDgwMDU4MzksImlhdCI6MTcwODAwNDkzOSwianRpIjoiYmZkMjEyZjAtYzdlYy00YTcxLWJlNDgtMTljODE3YjE0NzA0IiwiaXNzIjoiaHR0cHM6Ly9nYXRla2VlcGVyLXFhcy5qdW50b3NlZ3Vyb3MuY29tL2F1dGgvcmVhbG1zL3NlZ3VyYWRvcmFfYmV4IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjEzNjVkM2IzLWM5MDYtNGU1Mi1iOTkwLWM0MTJhNjM1YzNkZCIsInR5cCI6IkJlYXJlciIsImF6cCI6ImJyb2tlcl9wbGF0Zm9ybSIsInNlc3Npb25fc3RhdGUiOiJiMzE3MTZlZS01MTA2LTQ5MGItYWFjOS02ZjBkMjliZDUwODkiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vanVudG9zZWd1cm9zLnBvc3RtYW4uY28vKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy1zZWd1cmFkb3JhX2JleCIsInBvbGljeWhvbGRlciIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJGYWxjYW8iLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJmYWxjYW9jd2JfdG9tIiwiZ2l2ZW5fbmFtZSI6IkZhbGNhbyIsImVtYWlsIjoiYWx5bmVkY0BqdW50b3NlZ3Vyb3MuY29tIn0.FZrr0QTgW9JDo1cpPheZS22gU8qOOtYMEfFFhdiJxd_i1Gl0Urw5yTk-LYU-WXxhQlb8v0PYU3sm38FI-4Qy6yoAbc_wfMeSVEOEe6a1qkXbpaLqG-H2-a9dX2Jp4LMb0a2pEaJps9yZY0ypMzjf0Gk_vps1gVKuiXRzqEoG54WJw3-ScXSoZiFqXqrKGKVGMbw9hZFH-suXz0OJMPxR_64688HFMRdMHiCMozmKCR9eD55GnaXQ5YIA9D7efwJ3EFgJS8OtnnCqWPe8M1dk05lj3JhL685rpIPfLmqdLRhZGLQHrBYOaI4q85xDr4rHLEZtCEojjecrUSkKRTl6KA';
const mockCookie = `{"token": "${mockToken}", "refreshToken": "refresh-token", "refreshExpiresIn": 1800000, "expiresIn": 900000, "createAt": "${new Date().toISOString()}", "username": "test-user", "bonusJourney": { "isEligible": true, "isAcceptTerm": false, "lastCampaign": { "campaignId": 5, "dateStart": "2024-01-01T00:00:00", "dateEnd": "2024-12-31T23:59:05", "dateLimitRescue": "2025-01-17T23:59:59", "dateLimitAccept": "2024-04-30T23:59:59", "name": "Jornada de Bônus 2024" }}}`;

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

  it('getBroker should read user cookie and return broker object', () => {
    const mockBroker = {
      id: 1,
      externalId: 268010,
      name: 'teste corretor 1',
      userId: 1,
      federalId: '06465132135429',
      susepId: '2000000000',
      user: {
        id: 1,
        userName: 'testecorretor_cor',
        userType: 0,
        userTypeDescription: 'Corretor',
      },
    };
    jest
      .spyOn(BrokerPlatformAuthService, 'getUserAccessCookie')
      .mockImplementationOnce(() => {
        return {
          broker: mockBroker,
        };
      });
    const result = BrokerPlatformAuthService.getBroker();
    expect(result).toStrictEqual(mockBroker);
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

  it('getUserType should read broker from user cookie and return userType property', () => {
    const mockBroker = {
      id: 1,
      externalId: 268010,
      name: 'teste corretor 1',
      userId: 1,
      federalId: '06465132135429',
      susepId: '2000000000',
      user: {
        id: 1,
        userName: 'testecorretor_cor',
        userType: 0,
        userTypeDescription: 'Corretor',
      },
    };
    jest
      .spyOn(BrokerPlatformAuthService, 'getUserAccessCookie')
      .mockImplementationOnce(() => {
        return {
          broker: mockBroker,
        };
      });
    const result = BrokerPlatformAuthService.getUserType();
    expect(result).toEqual(0);
  });

  it('getUserProfile should return that user is COMMERCIAL correctly', () => {
    jest
      .spyOn(BrokerPlatformAuthService, 'getUserAccessCookie')
      .mockImplementationOnce(() => {
        return {
          token: mockCommercialToken,
        };
      });
    const result = BrokerPlatformAuthService.getUserProfile();
    expect(result).toBe(ProfileEnum.COMMERCIAL);
  });

  it('getUserProfile should return that user is BROKER correctly', () => {
    jest
      .spyOn(BrokerPlatformAuthService, 'getUserAccessCookie')
      .mockImplementationOnce(() => {
        return {
          token: mockToken,
        };
      });
    const result = BrokerPlatformAuthService.getUserProfile();
    expect(result).toBe(ProfileEnum.BROKER);
  });

  it('getUserProfile should return that user is POLICYHOLDER correctly', () => {
    jest
      .spyOn(BrokerPlatformAuthService, 'getUserAccessCookie')
      .mockImplementationOnce(() => {
        return {
          token: mockPolicyholderToken,
        };
      });
    const result = BrokerPlatformAuthService.getUserProfile();
    expect(result).toBe(ProfileEnum.POLICYHOLDER);
  });

  it('userHasPermission should validate if permission is present in cookie', () => {
    jest
      .spyOn(BrokerPlatformAuthService, 'getUserAccessCookie')
      .mockImplementationOnce(() => {
        return {
          permissions: [
            'permission.policyholder.issue',
            'permission.policyholder.reports',
          ],
        };
      });
    const result = BrokerPlatformAuthService.userHasPermission(
      'permission.policyholder.issue',
    );
    expect(result).toEqual(true);
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

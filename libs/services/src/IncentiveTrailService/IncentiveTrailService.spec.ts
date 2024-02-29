import Cookies from 'js-cookie';
import IncentiveTrailService from './IncentiveTrailService';

describe('IncentiveTrailService', () => {
  const mockToken =
    'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJueEt6aHhlR285amoyZzQwYWZmeVlDYlQybjJwTVVfQmdBQXNUb0EzZVFJIn0.eyJleHAiOjE2NDM5MDAyMjEsImlhdCI6MTY0Mzg5OTMyMSwianRpIjoiMjA2NmQzNmUtOWQ3Ny00NjFkLWE5NWEtNWJjYzFlZjZjODc3IiwiaXNzIjoiaHR0cHM6Ly9nYXRla2VlcGVyLXFhcy5qdW50b3NlZ3Vyb3MuY29tL2F1dGgvcmVhbG1zL3NlZ3VyYWRvcmFfYmV4IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6ImM3YzFkZTNlLTZmN2EtNDlhNy1iNTJmLWQ0NWVkZGY5MDM5MSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImJyb2tlcl9wbGF0Zm9ybSIsInNlc3Npb25fc3RhdGUiOiIxNzU5ZmMwOC02M2JkLTQ5ZDAtOGYxNi02Mjc3NDQ1NzVjMDMiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vanVudG9zZWd1cm9zLnBvc3RtYW4uY28vKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy1zZWd1cmFkb3JhX2JleCIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJicm9rZXIiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJnMXAxX2NvciIsInByZWZlcnJlZF91c2VybmFtZSI6ImcxcDFfY29yIiwiZ2l2ZW5fbmFtZSI6ImcxcDFfY29yIiwiZW1haWwiOiJiZXhAanVudG9zZWd1cm9zLmNvbSJ9.gCTYHFUNv6kg8kTuSSoBxlTlJy43TuqrtET6oqjgv7e50XcXBSZ5U2LoYwGVZo_ssIsw8wieN2y2k548BeOu1w22Bfn4vSSprncDte0k3raVejZyV54oLWN1g3KOkIL8IKschTd1_9AnNvU4NKskx_HouD7miEXUhO3Ca2SZ1q8QT4UWtWFnlpsbOJqZ5J22UOaqhLkzABjpmn2hvYn4X-Wy-3AI2umKfXALZ3b-4HHRKNSHLhmoRkqvYHCy0gboFo0X1eC1SRv6eKypDVMbY41J3j1j-_ToiKkDeUoPNtZ7tOVUkIpaVPsKbhjVMPpn1_VjiXmFxv2HNheAtK1bQQ';
  const mockCookie = `{"token": "${mockToken}", "refreshToken": "refresh-token", "refreshExpiresIn": 1800000, "expiresIn": 900000, "createAt": "${new Date().toISOString()}", "username": "test-user", "bonusJourney": { "isEligible": true, "isAcceptTerm": false, "lastCampaign": { "campaignId": 5, "dateStart": "2024-01-01T00:00:00", "dateEnd": "2024-12-31T23:59:05", "dateLimitRescue": "2025-01-17T23:59:59", "dateLimitAccept": "2024-04-30T23:59:59", "name": "Jornada de Bônus 2024" }}}`;

  it('getIncentiveTrailCampaign should read user cookie and returnlast campaign', () => {
    jest.spyOn(Cookies, 'get').mockReturnValue(mockCookie as any);
    const incentiveTrailCampaign =
      IncentiveTrailService.getIncentiveTrailCampaign();
    expect(incentiveTrailCampaign).toMatchObject({
      campaignId: 5,
      dateStart: '2024-01-01T00:00:00',
      dateEnd: '2024-12-31T23:59:05',
      dateLimitRescue: '2025-01-17T23:59:59',
      dateLimitAccept: '2024-04-30T23:59:59',
      name: 'Jornada de Bônus 2024',
    });
  });

  it('getIncentiveTrailIsEligible should read user cookie and return isEligible campaign', () => {
    jest.spyOn(Cookies, 'get').mockReturnValue(mockCookie as any);
    const isEligible = IncentiveTrailService.getIncentiveTrailIsEligible();
    expect(isEligible).toEqual(true);
  });

  it('getIncentiveTrailIsAccept should read user cookie and return isAcceptTerm campaign', () => {
    jest.spyOn(Cookies, 'get').mockReturnValue(mockCookie as any);
    const isAcceptTerm = IncentiveTrailService.getIncentiveTrailIsAccept();
    expect(isAcceptTerm).toEqual(false);
  });

  it('updateIncentiveTrailAcceptTerm should read user cookie and update isAcceptTerm campaign', () => {
    jest.spyOn(Cookies, 'get').mockReturnValue(mockCookie as any);
    const cookieRemoveMock = jest.spyOn(Cookies, 'remove');
    const cookieSetMock = jest.spyOn(Cookies, 'set');
    const mockResult = {
      ...JSON.parse(mockCookie),
      bonusJourney: {
        ...JSON.parse(mockCookie).bonusJourney,
        isAcceptTerm: true,
      },
    };
    IncentiveTrailService.updateIncentiveTrailAcceptTerm(true);
    expect(cookieRemoveMock).toHaveBeenCalledTimes(1);
    expect(cookieSetMock.mock.calls[0][1]).toEqual(JSON.stringify(mockResult));
  });
});

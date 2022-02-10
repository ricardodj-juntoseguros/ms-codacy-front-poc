import Cookies from 'js-cookie';
import AuthService from './AuthService';

const mockToken =
  'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJueEt6aHhlR285amoyZzQwYWZmeVlDYlQybjJwTVVfQmdBQXNUb0EzZVFJIn0.eyJleHAiOjE2NDM5MDAyMjEsImlhdCI6MTY0Mzg5OTMyMSwianRpIjoiMjA2NmQzNmUtOWQ3Ny00NjFkLWE5NWEtNWJjYzFlZjZjODc3IiwiaXNzIjoiaHR0cHM6Ly9nYXRla2VlcGVyLXFhcy5qdW50b3NlZ3Vyb3MuY29tL2F1dGgvcmVhbG1zL3NlZ3VyYWRvcmFfYmV4IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6ImM3YzFkZTNlLTZmN2EtNDlhNy1iNTJmLWQ0NWVkZGY5MDM5MSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImJyb2tlcl9wbGF0Zm9ybSIsInNlc3Npb25fc3RhdGUiOiIxNzU5ZmMwOC02M2JkLTQ5ZDAtOGYxNi02Mjc3NDQ1NzVjMDMiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vanVudG9zZWd1cm9zLnBvc3RtYW4uY28vKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy1zZWd1cmFkb3JhX2JleCIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJicm9rZXIiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJnMXAxX2NvciIsInByZWZlcnJlZF91c2VybmFtZSI6ImcxcDFfY29yIiwiZ2l2ZW5fbmFtZSI6ImcxcDFfY29yIiwiZW1haWwiOiJiZXhAanVudG9zZWd1cm9zLmNvbSJ9.gCTYHFUNv6kg8kTuSSoBxlTlJy43TuqrtET6oqjgv7e50XcXBSZ5U2LoYwGVZo_ssIsw8wieN2y2k548BeOu1w22Bfn4vSSprncDte0k3raVejZyV54oLWN1g3KOkIL8IKschTd1_9AnNvU4NKskx_HouD7miEXUhO3Ca2SZ1q8QT4UWtWFnlpsbOJqZ5J22UOaqhLkzABjpmn2hvYn4X-Wy-3AI2umKfXALZ3b-4HHRKNSHLhmoRkqvYHCy0gboFo0X1eC1SRv6eKypDVMbY41J3j1j-_ToiKkDeUoPNtZ7tOVUkIpaVPsKbhjVMPpn1_VjiXmFxv2HNheAtK1bQQ';
const mockCookie = `{"token": "${mockToken}", "refreshExpiresIn": 18000, "expiresIn": 9000, "createAt": "${new Date().toISOString()}" }`;

describe('AuthService', () => {
  it('isAuthenticated should read user cookie and validate token lifespan', () => {
    jest.spyOn(Cookies, 'get').mockReturnValue(mockCookie as any);

    const result = AuthService.isAuthenticated();
    expect(result).toBeTruthy();
  });

  it('isAuthenticated should return false if user cookie is not present', () => {
    jest.spyOn(Cookies, 'get').mockReturnValue(undefined as any);

    const result = AuthService.isAuthenticated();
    expect(result).toBeFalsy();
  });

  it('isBroker should read user cookie and validate if token realm roles array contains broker', () => {
    jest.spyOn(Cookies, 'get').mockReturnValue(mockCookie as any);
    const result = AuthService.isBroker();
    expect(result).toBeTruthy();
  });

  it('isBroker should return false if user cookie is not present', () => {
    jest.spyOn(Cookies, 'get').mockReturnValue(undefined as any);

    const result = AuthService.isBroker();
    expect(result).toBeFalsy();
  });
});

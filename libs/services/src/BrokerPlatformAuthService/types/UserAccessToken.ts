import { JwtPayload } from 'jwt-decode';

/* eslint-disable camelcase */
interface UserAccessTokenRealmAccess {
  roles: string[];
}

interface UserAccessToken extends JwtPayload {
  realm_access: UserAccessTokenRealmAccess;
  email: string;
  name: string;
  loginOwnerId?: string;
  loginOwnerUserName?: string;
}

export default UserAccessToken;

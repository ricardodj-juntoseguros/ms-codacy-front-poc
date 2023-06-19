/* eslint-disable camelcase */
import { JwtPayload } from 'jwt-decode';

interface UserAccessTokenRealmAccess {
  roles: string[];
}

export interface UserToken extends JwtPayload {
  realm_access: UserAccessTokenRealmAccess;
  email: string;
  name: string;
  preferred_username: string;
}

export default UserToken;

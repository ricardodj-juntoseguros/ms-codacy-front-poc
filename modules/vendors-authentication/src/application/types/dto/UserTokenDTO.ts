/* eslint-disable camelcase */
import { JwtPayload } from 'jwt-decode';

interface UserAccessTokenRealmAccess {
  roles: string[];
}

export interface UserTokenDTO extends JwtPayload {
  realm_access: UserAccessTokenRealmAccess;
  email: string;
  name: string;
}

export default UserTokenDTO;

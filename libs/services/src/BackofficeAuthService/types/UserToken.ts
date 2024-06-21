import { JwtPayload } from 'jwt-decode';

interface UserToken extends JwtPayload {
  UserId: string;
  Type: string;
  'permissions.subdepartment': string[];
}

export default UserToken;

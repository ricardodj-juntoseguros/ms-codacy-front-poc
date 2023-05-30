import { AxiosHttpClient } from '@infrastructure/http-client';
import { VendorsAuthService } from '@services';
import { UserTokenMock } from '../../../__mocks__/index';
import AuthApi from './AuthApi';
import { AuthenticationDTO } from '../../types/dto';

describe('AuthApi', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_VENDORS_BFF_URL = 'any_url';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('AuthApi should call bff service correctly', async () => {
    const userNameMock = 'cadsatroTeste';
    const passwordMocke = 'Parana.123';

    const mockPost = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => {
        return UserTokenMock;
      });

    const result = await AuthApi.postAuth(userNameMock, passwordMocke);

    expect(mockPost).toHaveBeenCalledWith({
      url: '/api/v1/login',
      payload: { username: userNameMock, password: passwordMocke },
    });
    expect(result).toBe(UserTokenMock);
  });

  it('AuthApi should call bff service correctly', async () => {
    const mock = jest
      .spyOn(VendorsAuthService, 'setUserAccessCookie')
      .mockImplementation();

    await AuthApi.setUserAccessCookie(UserTokenMock as AuthenticationDTO);

    expect(mock).toBeCalled();
  });
});

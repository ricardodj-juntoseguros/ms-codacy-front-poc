import { AxiosHttpClient } from '@infrastructure/http-client';
import { UserTokenMock } from '../../../__mocks__/index';
import AuthApi from './AuthApi';

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

  it('resetPassword should call bff service correctly', async () => {
    const hashMock = 'HAUSA29EI9JAD9AU9V9J9JF,EOKFK';
    const tokendMock = 'ZAWERFGVBNJKLRTYHGNM';
    const passwordMock = 'mock';

    const mockPut = jest
      .spyOn(AxiosHttpClient.prototype, 'put')
      .mockImplementation(async () => {
        return UserTokenMock;
      });

    await AuthApi.resetPassword(hashMock, tokendMock, passwordMock);

    expect(mockPut).toHaveBeenCalledWith({
      url: '/api/v1/user/password',
      payload: {
        hash: hashMock,
        token: tokendMock,
        value: passwordMock,
      },
    });
  });
});

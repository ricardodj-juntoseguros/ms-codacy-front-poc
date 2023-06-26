import { AxiosHttpClient } from '@infrastructure/http-client';
import PolicyholderContactAPI from './PolicyholderContactAPI';

describe('PolicyholderContactAPI', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_VENDORS_BFF_URL = 'any_url';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getContacts should call bff service correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return 'OK';
      });
    const result = await PolicyholderContactAPI.getContacts('91833813000118');
    expect(mockGet).toHaveBeenCalledWith({
      url: '/api/v1/policyholder/contacts',
      params: {
        federalId: '91833813000118',
      },
    });
    expect(result).toBe('OK');
  });

  it('createContact should call bff service correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => {
        return 'OK';
      });
    const contactMock = {
      name: 'John Doe',
      email: 'john@doe.com',
      federalId: '99999999999999',
    };
    const result = await PolicyholderContactAPI.createContact(
      contactMock.name,
      contactMock.email,
      contactMock.federalId,
    );
    expect(mockGet).toHaveBeenCalledWith({
      url: '/api/v1/policyholder/contacts',
      payload: contactMock,
    });
    expect(result).toBe('OK');
  });
});

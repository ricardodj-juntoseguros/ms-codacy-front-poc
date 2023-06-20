import { AxiosHttpClient } from '@infrastructure/http-client';
import IssuanceAPI from './IssuanceAPI';

describe('IssuanceAPI', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_VENDORS_BFF_URL = 'any_url';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('submitToApproval should call bff service correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => {
        return { message: 'ok' };
      });
    const policyIdMock = 12345;
    const result = await IssuanceAPI.submitToApproval(policyIdMock);
    expect(mockGet).toHaveBeenCalledWith({
      url: '/api/v1/issue',
      payload: { documentNumber: policyIdMock },
    });
    expect(result).toEqual({ message: 'ok' });
  });
});

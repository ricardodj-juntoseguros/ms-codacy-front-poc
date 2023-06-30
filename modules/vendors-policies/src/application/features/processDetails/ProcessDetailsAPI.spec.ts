import { AxiosHttpClient } from '@infrastructure/http-client';
import ProcessAPI from './ProcessDetailsAPI';

describe('ProcessDetailsAPI', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_VENDORS_BFF_URL = 'vendors_bff';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getProcessDetails should call bff service correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return 'OK';
      });
    const result = await ProcessAPI.getProcessDetails(12345);
    expect(mockGet).toHaveBeenCalledWith({
      url: '/api/v1/proposal/12345',
    });
    expect(result).toBe('OK');
  });
});

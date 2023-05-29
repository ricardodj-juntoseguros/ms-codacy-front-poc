import { AxiosHttpClient } from '@infrastructure/http-client';
import ProjectSelectionAPI from './ProjectSelectionAPI';

describe('ProjectSelectionAPI', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_VENDORS_BFF_URL = 'vendors_bff';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getProjects should call bff service correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return 'OK';
      });
    const result = await ProjectSelectionAPI.getProjects('LOREM');
    expect(mockGet).toHaveBeenCalledWith({
      url: '/api/v1/project',
      params: {
        name: 'LOREM',
      },
    });
    expect(result).toBe('OK');
  });
});

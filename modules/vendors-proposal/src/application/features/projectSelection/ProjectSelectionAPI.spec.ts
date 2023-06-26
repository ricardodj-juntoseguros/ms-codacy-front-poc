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
    const result = await ProjectSelectionAPI.getProjects();
    expect(mockGet).toHaveBeenCalledWith({
      url: '/api/v1/project',
    });
    expect(result).toBe('OK');
  });

  it('linkProject should call bff service correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => {
        return 'OK';
      });
    const result = await ProjectSelectionAPI.linkProject('LOREM', null, 12345);
    expect(mockGet).toHaveBeenCalledWith({
      url: '/api/v1/project',
      payload: { proposalId: 12345, name: 'LOREM' },
    });
    expect(result).toBe('OK');
  });
});

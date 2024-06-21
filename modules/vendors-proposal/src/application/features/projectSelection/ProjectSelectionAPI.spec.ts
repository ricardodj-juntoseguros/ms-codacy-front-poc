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
    const mockPost = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => {
        return 'OK';
      });
    const result = await ProjectSelectionAPI.linkProject(
      'LOREM',
      null,
      12345,
      '12321312',
    );
    expect(mockPost).toHaveBeenCalledWith({
      payload: {
        insuredFederalId: '12321312',
        name: 'LOREM',
        useDefault: false,
      },
      url: '/api/v1/project/reference/policy/12345',
    });
    expect(result).toBe('OK');
  });
});

import { AxiosHttpClient } from '@infrastructure/http-client';
import ProcessListingApi from './ProcessListingApi';
import { proposalListMock } from '../../../__mocks__';

describe('Process Listing API', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_VENDORS_BFF_URL = 'any_url';
  });

  it('getProcesses should call bff servcie correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementationOnce(async () => proposalListMock);

    const result = await ProcessListingApi.getProcesses(1, 10);

    expect(mockGet).toHaveBeenCalledWith({
      url: '/api/v1/proposal',
      params: { page: 1, pageSize: 10 },
    });

    expect(result).toStrictEqual(proposalListMock);
  });
});

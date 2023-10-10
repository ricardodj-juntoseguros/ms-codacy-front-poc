import { AxiosHttpClient } from '@infrastructure/http-client';
import ProcessListingApi from './ProcessListingApi';
import {
  getInsuredOptionsMock,
  searchPolicyholderOptionsMock,
  getStatusFilterOptionsMock,
  proposalListMock,
} from '../../../__mocks__';

describe('Process Listing API', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_VENDORS_BFF_URL = 'any_url';
  });

  it('getProcesses should call bff servcie correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementationOnce(async () => proposalListMock);

    const result = await ProcessListingApi.getProcesses(
      1,
      10,
      '12345',
      3,
      '88854911000127',
      '76941536000173',
    );

    expect(mockGet).toHaveBeenCalledWith({
      url: '/api/v1/proposal',
      params: {
        page: 1,
        pageSize: 10,
        identification: '12345',
        status: 3,
        insuredFederalId: '88854911000127',
        policyholderFederalId: '76941536000173',
      },
    });

    expect(result).toStrictEqual(proposalListMock);
  });

  it('[getStatusFilterOptions] should call bff service correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementationOnce(async () => getStatusFilterOptionsMock);

    const result = await ProcessListingApi.getStatusFilterOptions();

    expect(mockGet).toHaveBeenCalledWith({
      url: '/api/v1/proposal/filters/status',
    });
    expect(result.length).toBe(8);
  });

  it('[getInsuredOptions] should call bff service correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementationOnce(async () => getInsuredOptionsMock);

    const result = await ProcessListingApi.getInsuredOptions();

    expect(mockGet).toHaveBeenCalledWith({
      url: '/api/v1/insureds',
    });
    expect(result).toStrictEqual(getInsuredOptionsMock);
  });

  it('[searchPolicyholderOptionsMock] should call bff service correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementationOnce(async () => searchPolicyholderOptionsMock);

    const result = await ProcessListingApi.searchPolicyholderOptions('TOMADOR');

    expect(mockGet).toHaveBeenCalledWith({
      url: '/api/v1/policyholder',
      params: {
        corporateName: 'TOMADOR',
      },
    });
    expect(result).toStrictEqual(searchPolicyholderOptionsMock);
  });
});

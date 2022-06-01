import { AxiosHttpClient } from '@infrastructure/http-client';
import PolicyholderSelectionApi from './PolicyholderSelectionApi';

describe('PolicyholderSelectionApi', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_BROKER_PLATFORM_BFF_URL = 'any_url';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('searchPolicyHolder should call bff service correctly', async () => {
    const mockData = {
      hasMore: false,
      records: [
        {
          id: 1,
          name: 'test',
          federalId: '99999999999999',
        },
      ],
    };

    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return mockData;
      });

    const result = await PolicyholderSelectionApi.searchPolicyHolder('test');

    expect(mockGet).toHaveBeenCalledWith({
      url: 'repository/policyholders/search?q=test',
    });
    expect(result).toBe(mockData);
  });

  it('getPolicyholderDetails should call bff service correctly', async () => {
    const mockData = {
      Activity: '',
      City: 'Curitiba',
      Class: '',
      ClosingReferenceDay: 0,
      CompanyName: 'Test',
      District: 'Centro',
      Email: '',
      ExternalId: 12345,
      FederalId: '99999999999999',
      Hangs: [],
      Id: 1,
      InvoiceDueDateDay: 20,
      IsNew: false,
      PhoneNumber: undefined,
      ProducerRegionals: '',
      RegionalName: '',
      State: 'Paraná',
      Street: 'Rua Visconde de Nácar',
      UseBill: true,
      ValidCredit: true,
      ZipCode: '80410-201',
    };

    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return mockData;
      });

    const result = await PolicyholderSelectionApi.getPolicyholderDetails(
      1,
      '99999999999999',
    );

    expect(mockGet).toHaveBeenCalledWith({
      url: 'api/v2/policyholders?brokerExternalId=1&federalId=99999999999999',
    });
    expect(result).toBe(mockData);
  });

  it('getSubsidiaryByPolicyHolder should call bff service correctly', async () => {
    const mockData = [
      {
        id: 1,
        address: 'Rua Visconde de Nácar',
        cep: '80410-201',
        city: 'Curitiba',
        complement: '',
        country: 'Brasil',
        federalId: '99999999999999',
        name: 'Test',
        number: 1111,
        policyholdersId: 1,
        state: 'PR',
      },
    ];

    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return mockData;
      });

    const result = await PolicyholderSelectionApi.getSubsidiaryByPolicyHolder(
      1,
    );

    expect(mockGet).toHaveBeenCalledWith({
      url: 'api_policyholder/policyholders/1/getaffiliates',
    });
    expect(result).toBe(mockData);
  });
});

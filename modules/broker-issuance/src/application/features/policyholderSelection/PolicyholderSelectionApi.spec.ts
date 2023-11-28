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
      url: '/v1/policyholders/search?q=test',
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
      url: '/v1/policyholders/99999999999999?brokerExternalId=1',
    });
    expect(result).toBe(mockData);
  });

  it('postAppointmentLetter should call bff service correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => {
        return { message: 'ok' };
      });
    const file = new File(['(⌐□_□)'], 'file.pdf', {
      type: 'application/pdf',
    });
    const result = await PolicyholderSelectionApi.postAppointmentLetter('99999999999999', 12345, file);

    expect(mockGet.mock.calls[0][0]).toMatchObject({
      headers: {
        "Content-Type": "multipart/form-data"
      },
      payload: {},
      url: "/v1/policyholders/99999999999999/appointment-letter/upload?brokerExternalId=12345"
    });
    expect(result).toEqual({ message: 'ok' });
  });
});

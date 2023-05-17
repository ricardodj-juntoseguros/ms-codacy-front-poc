import { AxiosHttpClient } from '@infrastructure/http-client';
import ListingMappingApi from './ListingMappingApi';

describe('ListingMappingApi', () => {
  const dataMockOpportunityRequest = {
    numberOfRecords: 24,
    hasMore: true,
    hasPrevious: false,
    pageNumber: 1,
    pageSize: 10,
    records: [
      {
        id: 273,
        policyholderFederalId: '07989360000107',
        policyholderName: 'VECTOR SERVIÇOS DE ATENDIMENTO TELEFÔNICO LTDA',
        policyholderEconomicGroupName:
          'VECTOR SERVIÇOS DE ATENDIMENTO TELEFÔNICO',
        brokerFederalId: '43644285000106',
        brokerName: 'ITAÚ CORRETORA DE SEGUROS S.A.',
        category: 'Outros',
        createdAt: '2023-03-16T15:12:01.4718309',
        isPriority: true,
        statusId: 3,
        statusDescription: 'Bloqueado',
        queueTypes: [
          { id: 3, name: 'Esteira Trabalhista', quantity: 231 },
          { id: 4, name: 'Esteira Federal', quantity: 2 },
          { id: 5, name: 'Esteira Estadual', quantity: 0 },
        ],
        rowsCount: 24,
      },
      {
        id: 288,
        policyholderFederalId: '07989360000107',
        policyholderName: 'VECTOR SERVIÇOS DE ATENDIMENTO TELEFÔNICO LTDA',
        policyholderEconomicGroupName:
          'VECTOR SERVIÇOS DE ATENDIMENTO TELEFÔNICO',
        brokerFederalId: '43644285000106',
        brokerName: 'ITAÚ CORRETORA DE SEGUROS S.A.',
        category: 'Outros',
        createdAt: '2023-03-16T16:58:18.1790074',
        isPriority: true,
        statusId: 3,
        statusDescription: 'Bloqueado',
        queueTypes: [
          { id: 3, name: 'Esteira Trabalhista', quantity: 231 },
          { id: 4, name: 'Esteira Federal', quantity: 2 },
          { id: 5, name: 'Esteira Estadual', quantity: 0 },
        ],
        rowsCount: 24,
      },
    ],
  };

  const dataMockSummaryOpportunity = [
    { total: 0, status: 'DONE' },
    { total: 24, status: 'BLOCKED' },
    { total: 63, status: 'ON_QUEUE' },
  ];

  beforeAll(() => {
    process.env.NX_GLOBAL_GATEWAY_URL = 'any_url';
  });

  it('getListingMapping should call api with correct params', async () => {
    const pagenumber = 1;
    const pagesize = 2;
    const status = 'BLOCKED';
    const mockPost = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return Promise.resolve(dataMockOpportunityRequest);
      });

    const result = await new ListingMappingApi().getListingMapping(
      pagenumber,
      pagesize,
      status,
    );

    expect(mockPost).toHaveBeenCalledWith({
      url: '/backoffice/opportunityrequest',
      params: { pagenumber, pagesize, status },
    });
    expect(result).not.toBe(null);
  });

  it('getListingMapping should call api with correct params and  status done', async () => {
    const pagenumber = 1;
    const pagesize = 2;
    const status = 'DONE';
    const mockPost = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return Promise.resolve(dataMockOpportunityRequest);
      });

    const result = await new ListingMappingApi().getListingMapping(
      pagenumber,
      pagesize,
      status,
    );

    expect(mockPost).toHaveBeenCalledWith({
      url: '/backoffice/opportunityrequest',
      params: { pagenumber, pagesize, status },
    });
    expect(result).not.toBe(null);
  });

  it('getMappingSummary should call api to return a totalized list by status', async () => {
    const mockGetSummary = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return Promise.resolve(dataMockSummaryOpportunity);
      });

    const result = await new ListingMappingApi().getMappingSummary();

    expect(mockGetSummary).toHaveBeenCalledWith({
      url: '/backoffice/opportunityrequest/summary',
    });
    expect(result).not.toBe(null);
  });

  it('deleteMappingItem should call api to remove a solicitation by id', async () => {
    const mockDelete = jest
      .spyOn(AxiosHttpClient.prototype, 'delete')
      .mockImplementation(async () => {
        return Promise.resolve();
      });

    const result = await new ListingMappingApi().deleteMappingItem(1234);

    expect(mockDelete).toHaveBeenCalledWith({
      url: '/backoffice/opportunityrequest/1234',
    });
    expect(result).not.toBe(null);
  });

  it('patchMappingItem should call api to remove a solicitation by id', async () => {
    const mockPatch = jest
      .spyOn(AxiosHttpClient.prototype, 'patch')
      .mockImplementation(async () => {
        return Promise.resolve();
      });

    const result = await new ListingMappingApi().patchMappingItem(1234);

    expect(mockPatch).toHaveBeenCalledWith({
      url: '/backoffice/opportunityrequest/1234',
    });
    expect(result).not.toBe(null);
  });

  it('getDetailListingMapping should call api using id', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return Promise.resolve();
      });

    const result = await new ListingMappingApi().getDetailsListingMapping(5501);

    expect(mockGet).toHaveBeenCalledWith({
      url: '/backoffice/opportunityrequest/5501',
    });
    expect(result).not.toBe(null);
  });
});

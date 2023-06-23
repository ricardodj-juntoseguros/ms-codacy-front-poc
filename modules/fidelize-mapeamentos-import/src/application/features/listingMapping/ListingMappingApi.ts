import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import FidelizeImportMapeamentosBaseApi from '../FidelizeMapeamentosImportBaseApi';
import {
  RequestMappingDTO,
  MappingSummaryDTO,
  MappingDoneDetailsDTO,
  DetailsErrorRequest,
} from '../../types/dto';

class ListingMappingApi {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new FidelizeImportMapeamentosBaseApi().getInstance();
  }

  async getListingMapping(
    pagenumber: number,
    pagesize: number,
    status: string,
  ): Promise<RequestMappingDTO> {
    const params: IHttpClientRequestParameters = {
      url: '/backoffice/opportunityrequest',
      params: { pagenumber, pagesize, status },
    };

    return await this.instance.get<RequestMappingDTO>(params);
  }

  async getDetailsListingMapping(id: number): Promise<any> {
    const params: IHttpClientRequestParameters = {
      url: `/backoffice/opportunityrequest/${id}`,
    };

    return await this.instance.get<MappingDoneDetailsDTO | DetailsErrorRequest>(
      params,
    );
  }

  async getMappingSummary(): Promise<MappingSummaryDTO[]> {
    const params: IHttpClientRequestParameters = {
      url: '/backoffice/opportunityrequest/summary',
    };

    return await this.instance.get<MappingSummaryDTO[]>(params);
  }

  async deleteMappingItem(id: number): Promise<any> {
    const params: IHttpClientRequestParameters = {
      url: `/backoffice/opportunityrequest/${id}`,
    };

    return await this.instance.delete<any>(params);
  }

  async patchMappingItem(id: number): Promise<any> {
    const params: IHttpClientRequestParameters = {
      url: `/backoffice/opportunityrequest/${id}`,
    };

    return await this.instance.patch<any>(params);
  }

  async putMappingItem(id: number, data: any): Promise<any> {
    const params: IHttpClientRequestParameters = {
      url: `/backoffice/opportunityrequest/${id}`,
      payload: data,
    };

    return await this.instance.put<any>(params);
  }

  async downloadMappingItem(id: number, type: number): Promise<any> {
    const params: IHttpClientRequestParameters = {
      url: `/ms-opportunity-mapping/api/v2/opportunities/${id}/queue-type/${type}/download`,
      responseType: 'blob',
    };
    return await this.instance.get(params);
  }
}

export default ListingMappingApi;

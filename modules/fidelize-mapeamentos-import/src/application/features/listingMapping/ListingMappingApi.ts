import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import FidelizeImportMapeamentosBaseApi from '../FidelizeMapeamentosImportBaseApi';
import { OngoingMappingDTO, MappingSummaryDTO } from '../../types/dto';

class ListingMappingApi {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new FidelizeImportMapeamentosBaseApi().getInstance();
  }

  async getListingMapping(
    pagenumber: number,
    pagesize: number,
    status: string,
  ): Promise<OngoingMappingDTO> {
    const params: IHttpClientRequestParameters = {
      url: '/backoffice/opportunityrequest',
      params: { pagenumber, pagesize, status },
    };

    return await this.instance.get<OngoingMappingDTO>(params);
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
}

export default ListingMappingApi;

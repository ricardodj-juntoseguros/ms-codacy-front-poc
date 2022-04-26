import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import { OpportunityDetailsDTO } from '../../types/dto';
import { ModalityEnum, OpportunityDetailsOrderEnum } from '../../types/model';
import FidelizeDashboardBaseApi from '../FidelizeDashboardBaseApi';

class OpportunitiesDetailsApi {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new FidelizeDashboardBaseApi().getInstance();
  }

  async getOpportunitiesDetailsByModality(
    modality: ModalityEnum,
    page: number,
    pageSize: number,
    orderBy: OpportunityDetailsOrderEnum,
    direction: string,
    federalids: string[],
  ): Promise<OpportunityDetailsDTO> {
    const query: any = {
      page,
      pageSize,
      orderBy,
      direction,
    };
    if (federalids.length > 0) {
      query.federalids = federalids.join(',');
    }
    const params: IHttpClientRequestParameters = {
      url: `/v1/opportunities/${modality}`,
      params: query,
    };

    return await this.instance.get<OpportunityDetailsDTO>(params);
  }

  async sendMoreOpportunityDetailsMail(opportunityId: string): Promise<any> {
    const params: IHttpClientRequestParameters = {
      url: '/v1/opportunities/mail/mapping-details',
      payload: { opportunityId },
    };

    return await this.instance.post(params);
  }
}

export default new OpportunitiesDetailsApi();

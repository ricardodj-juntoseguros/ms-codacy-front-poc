import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import { OpportunityDetailsDTO } from '../../types/dto';
import { ModalityEnum } from '../../types/model';
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
  ): Promise<OpportunityDetailsDTO> {
    const params: IHttpClientRequestParameters = {
      url: `/v1/opportunities/${modality}`,
      params: { page, pageSize },
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

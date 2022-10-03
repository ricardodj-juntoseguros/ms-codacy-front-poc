import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import {
  OpportunitiesFiltersContentDTO,
  OpportunityCompleteDetailsDTO,
  OpportunityDetailsDTO,
} from '../../types/dto';
import {
  ModalityEnum,
  OpportunitiesDetailsFilterModel,
  OpportunityDetailsOrderEnum,
} from '../../types/model';
import { getFiltersQueryParams } from '../../../helpers';
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
    filters?: OpportunitiesDetailsFilterModel[] | undefined,
  ): Promise<OpportunityDetailsDTO> {
    let query: any = {
      page,
      pageSize,
      orderBy,
      direction,
    };
    if (federalids.length > 0) {
      query.federalids = federalids.join(',');
    }
    if (filters && filters.length > 0) {
      query = { ...query, ...getFiltersQueryParams(filters) };
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

  async sendMoreDetailsFromOpportunityList(
    modality: ModalityEnum,
    opportunitiesIds: string[],
    emailsToSend: string[],
  ): Promise<any> {
    const params: IHttpClientRequestParameters = {
      url: `/v2/opportunities/${modality}/mapping-details`,
      payload: { opportunities: opportunitiesIds, otherEmails: emailsToSend },
    };

    return await this.instance.post(params);
  }

  async getFiltersContentByModality(
    modality: ModalityEnum,
  ): Promise<OpportunitiesFiltersContentDTO> {
    const params: IHttpClientRequestParameters = {
      url: `/v1/filters/${modality}`,
    };
    return await this.instance.get<OpportunitiesFiltersContentDTO>(params);
  }

  async getOpportunityCompleteDetailsByModalityAndId(
    modality: ModalityEnum,
    opportunityId: string,
  ): Promise<OpportunityCompleteDetailsDTO> {
    const params: IHttpClientRequestParameters = {
      url: `/v1/opportunities/${modality}/${opportunityId}`,
    };
    return await this.instance.get<OpportunityCompleteDetailsDTO>(params);
  }
}

export default new OpportunitiesDetailsApi();

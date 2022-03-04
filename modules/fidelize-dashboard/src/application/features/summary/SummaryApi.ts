import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import { ModalitySummaryDTO } from '../../types/dto/ModalitySummaryDTO';
import { SummaryPolicyholdersDTO } from '../../types/dto/SummaryPolicyholdersDTO';
import FidelizeDashboardBaseApi from '../FidelizeDashboardBaseApi';

class SummaryApi {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new FidelizeDashboardBaseApi().getInstance();
  }

  async getPolicyholdersTotal(): Promise<SummaryPolicyholdersDTO> {
    const params: IHttpClientRequestParameters = {
      url: '/v1/opportunities/summary/policyholders',
    };

    return await this.instance.get<SummaryPolicyholdersDTO>(params);
  }

  async getModalitiesSummary(): Promise<ModalitySummaryDTO[]> {
    const params: IHttpClientRequestParameters = {
      url: '/v1/opportunities/summary/modalities',
    };

    return await this.instance.get<ModalitySummaryDTO[]>(params);
  }
}

export default new SummaryApi();

import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import { SummaryPolicyholdersDTO } from '../../types/dto/SummaryPolicyholdersDTO';
import FidelizeDashboardBaseApi from '../FidelizeDashboardBaseApi';

class SummaryApi {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new FidelizeDashboardBaseApi().getInstance();
  }

  async getPolicyholdersTotal(): Promise<SummaryPolicyholdersDTO> {
    const params: IHttpClientRequestParameters = {
      url: '/opportunities/summary/policyholders',
    };

    return await this.instance.get<SummaryPolicyholdersDTO>(params);
  }
}

export default new SummaryApi();

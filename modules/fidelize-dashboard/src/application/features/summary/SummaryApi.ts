import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import { ModalitySummaryDTO } from '../../types/dto';
import FidelizeDashboardBaseApi from '../FidelizeDashboardBaseApi';

class SummaryApi {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new FidelizeDashboardBaseApi().getInstance();
  }

  async getModalitiesSummary(
    federalids: string[],
  ): Promise<ModalitySummaryDTO[]> {
    const query =
      federalids.length > 0 ? { federalids: federalids.join(',') } : {};

    const params: IHttpClientRequestParameters = {
      url: '/v1/opportunities/summary/modalities',
      params: query,
    };

    return await this.instance.get<ModalitySummaryDTO[]>(params);
  }
}

export default new SummaryApi();

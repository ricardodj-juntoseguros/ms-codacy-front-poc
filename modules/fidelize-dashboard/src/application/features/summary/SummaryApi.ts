import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import { ModalitiesSummaryDTO } from '../../types/dto';
import FidelizeDashboardBaseApi from '../FidelizeDashboardBaseApi';

class SummaryApi {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new FidelizeDashboardBaseApi().getInstance();
  }

  async getModalitiesSummary(
    federalids: string[],
  ): Promise<ModalitiesSummaryDTO> {
    const query =
      federalids.length > 0 ? { federalids: federalids.join(',') } : {};

    const params: IHttpClientRequestParameters = {
      url: '/v2/opportunities/summary/modalities',
      params: query,
    };

    return await this.instance.get<ModalitiesSummaryDTO>(params);
  }
}

export default new SummaryApi();

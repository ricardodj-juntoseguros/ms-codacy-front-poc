import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import { SummaryChartDataDTO } from '../../types/dto';
import { ModalityEnum, SummaryChartTypeEnum } from '../../types/model';
import FidelizeDashboardBaseApi from '../FidelizeDashboardBaseApi';

class SummaryChartsApi {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new FidelizeDashboardBaseApi().getInstance();
  }

  async getChartData(
    modality: ModalityEnum,
    chartType: SummaryChartTypeEnum,
    federalids: string[],
  ): Promise<SummaryChartDataDTO> {
    const query =
      federalids.length > 0 ? { federalids: federalids.join(',') } : {};

    const params: IHttpClientRequestParameters = {
      url: `/v1/charts/${modality}/${chartType}`,
      params: query,
    };

    return await this.instance.get<SummaryChartDataDTO>(params);
  }
}

export default new SummaryChartsApi();

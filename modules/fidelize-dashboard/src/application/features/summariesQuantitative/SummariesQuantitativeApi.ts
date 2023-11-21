import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import FidelizeDashboardBaseApi from '../FidelizeDashboardBaseApi';

class SummariesQuantitativeApi {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new FidelizeDashboardBaseApi().getInstance();
  }

  async getSummariesByPolicyholdersList(policyholders: string[]): Promise<any> {
    const params: IHttpClientRequestParameters = {
      url: '/v1/policyholders/processes/quantitative',
      payload: policyholders,
    };

    return await this.instance.post(params);
  }
}

export default new SummariesQuantitativeApi();

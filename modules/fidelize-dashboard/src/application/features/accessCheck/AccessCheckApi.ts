import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import FidelizeDashboardBaseApi from '../FidelizeDashboardBaseApi';

class AccessCheckApi {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new FidelizeDashboardBaseApi().getInstance();
  }

  async checkAccessToDashboard(): Promise<any> {
    const params: IHttpClientRequestParameters = {
      url: '/v1/access',
    };

    return await this.instance.get<any>(params);
  }

  async checkAccessToFeature(feature: string): Promise<any> {
    const params: IHttpClientRequestParameters = {
      url: '/v2/access',
      params: {
        feature,
      },
    };
    return await this.instance.get<any>(params);
  }
}

export default new AccessCheckApi();

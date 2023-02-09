import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import { BrokerLastAccessDTO } from '../../types/dto';
import FidelizeDashboardBaseApi from '../FidelizeDashboardBaseApi';

class LastAccessValidationApi {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new FidelizeDashboardBaseApi().getInstance();
  }

  async getBrokerLastAccessDate(): Promise<BrokerLastAccessDTO> {
    const params: IHttpClientRequestParameters = {
      url: '/v2/access/information',
    };
    return await this.instance.get<BrokerLastAccessDTO>(params);
  }

  async saveBrokerLastAccess(): Promise<any> {
    const params: IHttpClientRequestParameters = {
      url: '/v2/access/information',
    };
    return await this.instance.post<any>(params);
  }
}

export default new LastAccessValidationApi();

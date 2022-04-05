import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import { PolicyholderDTO } from '../../types/dto';
import FidelizeDashboardBaseApi from '../FidelizeDashboardBaseApi';

class PolicyholderFilterApi {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new FidelizeDashboardBaseApi().getInstance();
  }

  async getMappedPolicyholderList(): Promise<PolicyholderDTO[]> {
    const params: IHttpClientRequestParameters = {
      url: '/v1/policyholders',
    };

    return await this.instance.get<PolicyholderDTO[]>(params);
  }
}

export default new PolicyholderFilterApi();

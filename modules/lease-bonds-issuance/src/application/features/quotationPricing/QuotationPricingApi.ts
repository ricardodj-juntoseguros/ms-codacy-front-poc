import {
  IHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import { PolicyholderBalanceLimitsDTO } from '../../types/dto';
import LeaseBondsIssuanceBaseApi from '../LeaseBondsIssuanceBaseApi';

class QuotationPricingApi {
  private readonly httpClient: IHttpClient;

  public constructor() {
    this.httpClient = new LeaseBondsIssuanceBaseApi().getInstance();
  }

  async getPolicyholderBalanceLimits(
    policyholderId: number,
    modalityId: number,
  ) {
    const params: IHttpClientRequestParameters = {
      url: `/v1/policyholders/${policyholderId}/balance-limits`,
      params: {
        modalityId,
      },
    };
    return this.httpClient.get<PolicyholderBalanceLimitsDTO>(params);
  }
}

export default new QuotationPricingApi();

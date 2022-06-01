import {
  IHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import {
  PolicyholderDTO,
  SubsidiaryDTO,
  PolicyholderSearchDTO,
} from '../../types/dto';
import IssueBrokerBaseApi from '../IssueBrokerBaseApi';

class PolicyholderSelectionApi {
  private readonly httpClient: IHttpClient;

  public constructor() {
    this.httpClient = new IssueBrokerBaseApi().getInstance();
  }

  async searchPolicyHolder(policyHolderLabel: string) {
    const params: IHttpClientRequestParameters = {
      url: `repository/policyholders/search?q=${policyHolderLabel}`,
    };
    return this.httpClient.get<PolicyholderSearchDTO>(params);
  }

  async getPolicyholderDetails(brokerId: number, federalId: string) {
    const params: IHttpClientRequestParameters = {
      url: `api/v2/policyholders?brokerExternalId=${brokerId}&federalId=${federalId}`,
    };

    return this.httpClient.get<PolicyholderDTO>(params);
  }

  async getSubsidiaryByPolicyHolder(policyholderId: number) {
    const params: IHttpClientRequestParameters = {
      url: `api_policyholder/policyholders/${policyholderId}/getaffiliates`,
    };
    return this.httpClient.get<SubsidiaryDTO[]>(params);
  }
}

export default new PolicyholderSelectionApi();

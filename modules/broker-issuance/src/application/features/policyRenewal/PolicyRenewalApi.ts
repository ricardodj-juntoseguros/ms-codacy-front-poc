import {
  IHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import { RenewalDocumentListDTO, VerifyPolicyDTO } from '../../types/dto';
import BrokerInssuanceBaseApi from '../BrokerIssuanceBaseApi';

class PolicyRenewalApi {
  private readonly httpClient: IHttpClient;

  public constructor() {
    this.httpClient = new BrokerInssuanceBaseApi().getInstance();
  }

  async verifyPolicy(policyNumber: string, policyholderId?: number) {
    const params: IHttpClientRequestParameters = {
      url: `/v1/policies/${policyNumber}/policyholder/${policyholderId}/verify`,
    };
    return this.httpClient.get<VerifyPolicyDTO>(params);
  }

  async getRenewalDocumentList() {
    const params: IHttpClientRequestParameters = {
      url: '/v1/policies/renewal/documents',
    };
    return this.httpClient.get<RenewalDocumentListDTO>(params);
  }
}

export default new PolicyRenewalApi();

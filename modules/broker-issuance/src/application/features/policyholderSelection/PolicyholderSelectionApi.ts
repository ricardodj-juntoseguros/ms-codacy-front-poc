import {
  IHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import { PolicyholderSearchDTO, PolicyholderDTO } from '../../types/dto';
import BrokerInssuanceBaseApi from '../BrokerIssuanceBaseApi';

class PolicyholderSelectionApi {
  private readonly httpClient: IHttpClient;

  public constructor() {
    this.httpClient = new BrokerInssuanceBaseApi().getInstance();
  }

  async searchPolicyHolder(policyHolderLabel: string) {
    const params: IHttpClientRequestParameters = {
      url: `/v1/policyholders/search?q=${policyHolderLabel}`,
    };
    return this.httpClient.get<PolicyholderSearchDTO>(params);
  }

  async getPolicyholderDetails(brokerId: number, federalId: string) {
    const params: IHttpClientRequestParameters = {
      url: `/v1/policyholders/${federalId}?brokerExternalId=${brokerId}`,
    };
    return this.httpClient.get<PolicyholderDTO>(params);
  }

  async postAppointmentLetter(
    policyholderFederalId: string,
    brokerId: number,
    file: File,
  ) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const params: IHttpClientRequestParameters = {
      url: `/v1/policyholders/${policyholderFederalId}/appointment-letter/upload?brokerExternalId=${brokerId}`,
      headers: { 'Content-Type': 'multipart/form-data' },
      payload: formData,
    };
    return this.httpClient.post(params);
  }
}

export default new PolicyholderSelectionApi();

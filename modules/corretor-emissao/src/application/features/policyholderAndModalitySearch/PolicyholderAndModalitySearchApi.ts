import {
  AxiosHttpClient,
  IHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import { ModalityDTO, PolicyholderDTO, SubsidiaryDTO } from '../../types/dto';

class PolicyholderAndModalitySearchApi {
  private readonly httpClient: IHttpClient;

  public constructor() {
    this.httpClient = new AxiosHttpClient(
      'https://ms-gateway-qas.juntoseguros.com/squad1/plataforma-preview-api/',
      100000,
    );
  }

  async searchPolicyHolder(policyHolderLabel: string) {
    const params: IHttpClientRequestParameters = {
      url: `/policyholder?policyholderName=${policyHolderLabel}`,
    };
    return this.httpClient.get<PolicyholderDTO[]>(params);
  }

  async getModalitiesByPolicyholder(federalId: string) {
    const params: IHttpClientRequestParameters = {
      url: `/policyholderModality?federalId=${federalId}`,
    };
    const policyholderModalitiesData = await this.httpClient.get<ModalityDTO[]>(
      params,
    );

    return policyholderModalitiesData;
  }

  async getSubsidiaryByPolicyHolder(id: number) {
    const params: IHttpClientRequestParameters = {
      url: `/subsidiary?headquartersId=${id}`,
    };
    return this.httpClient.get<SubsidiaryDTO[]>(params);
  }
}

export default new PolicyholderAndModalitySearchApi();

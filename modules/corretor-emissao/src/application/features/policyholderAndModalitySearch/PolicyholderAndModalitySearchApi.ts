import {
  AxiosHttpClient,
  IHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import { ModalityDTO, PolicyholderDTO, SubsidiaryDTO } from '../../types/dto';

class PolicyholderAndModalitySearchApi {
  private readonly httpClient: IHttpClient;

  public constructor() {
    this.httpClient = new AxiosHttpClient('http://localhost:4300', 100000);
  }

  async searchPolicyHolder(policyHolderLabel: string) {
    const params: IHttpClientRequestParameters = {
      url: `/policyholder?policyholderLabel=${policyHolderLabel}`,
    };
    return this.httpClient.get<PolicyholderDTO[]>(params);
  }

  async getModalitiesByPolicyholder(federalId: string) {
    type PolicyholderModalitiesData = {
      federalId: string;
      modalityId: number;
    };

    const params: IHttpClientRequestParameters = {
      url: `/policyholderModality?federalId=${federalId}`,
    };
    const policyholderModalitiesData = await this.httpClient.get<
      PolicyholderModalitiesData[]
    >(params);

    const policyholderModalities = await Promise.all(
      policyholderModalitiesData.map(policyholderModality => {
        const { modalityId } = policyholderModality;
        const params: IHttpClientRequestParameters = {
          url: `/modality/${modalityId}`,
        };
        return this.httpClient.get<ModalityDTO>(params);
      }),
    );
    return policyholderModalities;
  }

  async getSubsidiaryByPolicyHolder(id: number) {
    const params: IHttpClientRequestParameters = {
      url: `/subsidiary?headquartersId=${id}`,
    };
    return this.httpClient.get<SubsidiaryDTO[]>(params);
  }
}

export default new PolicyholderAndModalitySearchApi();

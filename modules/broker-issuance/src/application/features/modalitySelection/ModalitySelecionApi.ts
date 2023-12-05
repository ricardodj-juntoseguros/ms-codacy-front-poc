import {
  IHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import { ModalityDTO } from '../../types/dto';
import IssueBrokerBaseApi from '../BrokerIssuanceBaseApi';

class ModalitySelectionApi {
  private readonly httpClient: IHttpClient;

  public constructor() {
    this.httpClient = new IssueBrokerBaseApi().getInstance();
  }

  async fetchModalities(
    brokerFederalId: string,
    policyholderFederalId: string,
  ): Promise<ModalityDTO[]> {
    const params: IHttpClientRequestParameters = {
      url: `/v1/products/policyholder/${policyholderFederalId}/modalities?brokerFederalId=${brokerFederalId}`,
    };
    return this.httpClient.get<ModalityDTO[]>(params);
  }
}

export default new ModalitySelectionApi();

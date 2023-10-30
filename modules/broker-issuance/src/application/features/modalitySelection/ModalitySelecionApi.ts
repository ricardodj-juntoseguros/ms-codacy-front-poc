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

  async getModalitiesByPolicyholder(id: number) {
    const params: IHttpClientRequestParameters = {
      url: `api_policyholder/policyholders/${id}/modalities-to-policyholder`,
    };

    const policyholderModalitiesData = await this.httpClient.get<ModalityDTO[]>(
      params,
    );

    return policyholderModalitiesData;
  }
}

export default new ModalitySelectionApi();

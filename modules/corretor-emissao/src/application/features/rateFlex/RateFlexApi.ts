import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import { RateFlexPermissionDTO } from '../../types/dto/RateFlexPermissionDTO';
import IssueBrokerBaseApi from '../IssueBrokerBaseApi';

class RateFlexApi {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new IssueBrokerBaseApi().getInstance();
  }

  async getRateFlexEnabled(
    brokerId: number,
    modalityId: number,
  ): Promise<RateFlexPermissionDTO> {
    const params: IHttpClientRequestParameters = {
      url: `api_policyholder/policyholders/${brokerId}/modality/${modalityId}/flextaxenabled`,
    };

    return await this.instance.get<RateFlexPermissionDTO>(params);
  }
}

export default new RateFlexApi();

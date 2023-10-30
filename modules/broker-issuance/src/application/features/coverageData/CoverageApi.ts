import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import { LimitDTO } from '../../types/dto/LimitDTO';
import IssueBrokerBaseApi from '../BrokerIssuanceBaseApi';

class CoverageApi {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new IssueBrokerBaseApi().getInstance();
  }

  async getLimitCoverage(
    policyholderId: number,
    modalityId: number,
  ): Promise<LimitDTO> {
    const params: IHttpClientRequestParameters = {
      url: `api/policyholders/${policyholderId}/balancelimit-policyholder?modalityExternalId=${modalityId}`,
    };

    return await this.instance.get<LimitDTO>(params);
  }
}

export default new CoverageApi();

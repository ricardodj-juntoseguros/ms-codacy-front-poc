import {
  IHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import { RealStateDTO, RealStateSearchDTO } from '../../types/dto';
import LeaseBondsIssuanceBaseApi from '../LeaseBondsIssuanceBaseApi';

class RealStateSelectionApi {
  private readonly httpClient: IHttpClient;

  public constructor() {
    this.httpClient = new LeaseBondsIssuanceBaseApi().getInstance();
  }

  async getRealStateDetails(realStateLabel?: string) {
    const params: IHttpClientRequestParameters = {
      url: `/real-state`,
      params: {
        q: realStateLabel,
      },
    };
    return this.httpClient.get<RealStateDTO>(params);
  }

  async searchRealState(brokerId: string, federalId: string) {
    const params: IHttpClientRequestParameters = {
      url: `/real-state/${federalId}?brokerFederalId=${brokerId}`,
    };

    return this.httpClient.get<RealStateSearchDTO>(params);
  }
}

export default new RealStateSelectionApi();

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

  async searchRealState(realStateLabel?: string) {
    const params: IHttpClientRequestParameters = {
      url: `/v1/real-state/search`,
      params: {
        q: realStateLabel,
      },
    };
    return this.httpClient.get<RealStateSearchDTO>(params);
  }
  
  async getRealStateDetails(brokerId: number, federalId: string) {
    const params: IHttpClientRequestParameters = {
      url: `/v1/real-state/${federalId}?brokerExternalId=${brokerId}`,
    };
    return this.httpClient.get<RealStateDTO>(params);
  }
}

export default new RealStateSelectionApi();

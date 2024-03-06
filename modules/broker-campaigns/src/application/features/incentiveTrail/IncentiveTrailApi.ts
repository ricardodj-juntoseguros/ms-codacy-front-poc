import {
  IHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import BrokerCampaignsBaseApi from '../BrokerCampaignsBaseApi';
import { IncentiveTrailDTO } from '../../types/dto';

class IncentiveTrailApi {
  private readonly httpClient: IHttpClient;

  public constructor() {
    this.httpClient = new BrokerCampaignsBaseApi().getInstance();
  }

  getCampaignData = async (
    campaignId: number,
    brokerFederalId: string,
    isCommercial = false,
  ): Promise<IncentiveTrailDTO> => {
    const commercialPartialUrl = isCommercial ? 'superuser/' : '';
    const params: IHttpClientRequestParameters = {
      url: `${commercialPartialUrl}ms-bonus-journey/producttion/calculate`,
      params: {
        campaignId,
        brokerFederalId,
      },
    };
    return this.httpClient.get<IncentiveTrailDTO>(params);
  };

  postAcceptIncentiveTrail = async (campaignId: number): Promise<void> => {
    const params: IHttpClientRequestParameters = {
      url: `bonus_journey/send/accept/term`,
      payload: {
        campaignId,
      },
    };
    return this.httpClient.post(params);
  };
}

export default new IncentiveTrailApi();

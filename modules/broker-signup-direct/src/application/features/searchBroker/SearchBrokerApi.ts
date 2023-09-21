import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import BrokerSignupBaseApi from '../BrokerSignupBaseApi';
import { SearchRegisterBrokerDTO } from '../../types/dto';

class SearchBrokerApi {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new BrokerSignupBaseApi().getInstance();
  }

  async searchRegisterBroker(brokerFederalId: string):Promise<SearchRegisterBrokerDTO> {
    const headers = {};

    const params: IHttpClientRequestParameters = {
      headers,
      url: `/signup/broker/${brokerFederalId}`,
    };
    return await this.instance.get<SearchRegisterBrokerDTO>(params);
  }
}

const searchBrokerApi = new SearchBrokerApi();
export default searchBrokerApi;

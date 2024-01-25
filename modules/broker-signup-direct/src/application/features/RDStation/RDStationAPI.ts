import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import BrokerSignupBaseApi from '../BrokerSignupBaseApi';
import { RDLeadBrokerSignupDTO } from '../../types/dto';

class RDStationAPI {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new BrokerSignupBaseApi().getInstance();
  }

  async authRDBrokerSignup() {
    const params: IHttpClientRequestParameters = {
      url: '/ms-leads-rdstation/leads/token/brokerSignup',
    };
    return await this.instance.get(params);
  }

  async addLeadBrokerSignup(rdLeadBrokerSignupDTO: RDLeadBrokerSignupDTO) {
    const params: IHttpClientRequestParameters = {
      url: `/ms-leads-rdstation/leads/leadSignupBroker`,
      payload: rdLeadBrokerSignupDTO,
    };
    return await this.instance.post(params);
  }
}

const rdStationAPI = new RDStationAPI();
export default rdStationAPI;

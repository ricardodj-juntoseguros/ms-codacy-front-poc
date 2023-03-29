import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import BrokerSignupBaseApi from '../BrokerSignupBaseApi';
import { StatusSusepDTO } from '../../../application/types/dto';

class CheckSusep {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new BrokerSignupBaseApi().getInstance();
  }

  async getStatusSusep(brokerFederalId: string):Promise<StatusSusepDTO> {
    const params: IHttpClientRequestParameters = {
      url: `/api_susep/v1/brokers/${brokerFederalId}`,
    };
    return await this.instance.get<StatusSusepDTO>(params);
  }
}

const checkSusep = new CheckSusep();
export default checkSusep;

import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import BrokerSignupBaseApi from '../BrokerSignupBaseApi';
import { RegisterBrokerDTO } from '../../types/dto';

class RegisterBrokerApi {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new BrokerSignupBaseApi().getInstance();
  }

  async registerBroker(registerBrokerPayload: RegisterBrokerDTO) {
    const params: IHttpClientRequestParameters = {
      url: `/brokers/signup`,
      payload: registerBrokerPayload,
    };

    return await this.instance.post<string>(params);
  }

  async updateRegisterBroker(payload: any, path: string) {
    const params: IHttpClientRequestParameters = {
      url: `/brokers/signup?id=${path}`,
      payload
    };

    return await this.instance.patch<string>(params);
  }

  async registerBrokerGV(path: string) {
    const params: IHttpClientRequestParameters = {
      url: `/brokers/signup/create?id=${path}`,
    };

    return await this.instance.post<string>(params);
  }
}

const registerBrokerApi = new RegisterBrokerApi();
export default registerBrokerApi;

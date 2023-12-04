import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import BrokerSignupBaseApi from '../BrokerSignupBaseApi';
import {
  RegisterBrokerDTO,
  RegisterBrokerNewUserDTO,
  SearchRegisterBrokerDTO,
  verifyTokenDTO,
} from '../../types/dto';
import { SimpleOptantDTO } from '../../types/dto/SimpleOptantDTO';

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
      payload,
    };

    return await this.instance.patch<string>(params);
  }

  async registerBrokerGV(path: string, signupDirect: boolean) {
    const params: IHttpClientRequestParameters = {
      url: `/brokers/signup/upsert?id=${path}&signupDirect=${signupDirect}`,
    };

    return await this.instance.post<string>(params);
  }

  async checkEmailExists(email: string) {
    const params: IHttpClientRequestParameters = {
      url: `/brokers/users/exists?email=${email}`,
    };
    return await this.instance.get<string>(params);
  }

  async SendValidationEmail(pathUser: string) {
    const params: IHttpClientRequestParameters = {
      url: `/brokers/signup/validation/email?id=${pathUser}`,
    };
    return await this.instance.post<string>(params);
  }

  async GetValidationCodeEmail(code: string, pathUser: string) {
    const params: IHttpClientRequestParameters = {
      url: `/brokers/signup/validation/email?code=${code}&id=${pathUser}`,
    };
    return await this.instance.get<boolean>(params);
  }

  async validateUser(user: string) {
    const params: IHttpClientRequestParameters = {
      url: `/brokers/users/${user}/checkUsernameExists`,
    };
    return await this.instance.get<boolean>(params);
  }

  async createNewUser(registerBrokerNewUserPayload: RegisterBrokerNewUserDTO) {
    const params: IHttpClientRequestParameters = {
      url: `/api_policies/brokers/create/newuser`,
      payload: registerBrokerNewUserPayload,
    };
    return await this.instance.post<boolean>(params);
  }

  async isSimpleOptant(federalId: string) {
    const params: IHttpClientRequestParameters = {
      url: `/signup/broker/${federalId}`,
    };
    return await this.instance.get<SearchRegisterBrokerDTO>(params);
  }

  async hasTaxCollection(pathUser: string) {
    const params: IHttpClientRequestParameters = {
      url: `/brokers/simpleOptant?userId=${pathUser}`,
    };
    return await this.instance.get<SimpleOptantDTO>(params);
  }

  async verifyTokenValiditySignupInternalized(guid: string) {
    const params: IHttpClientRequestParameters = {
      url: `/api_policies/brokers/create/continue/${guid}`,
    };
    return await this.instance.get<verifyTokenDTO>(params);
  }
}

const registerBrokerApi = new RegisterBrokerApi();
export default registerBrokerApi;

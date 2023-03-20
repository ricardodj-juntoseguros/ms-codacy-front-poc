import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import BrokerSignupBaseApi from '../BrokerSignupBaseApi';
import { BankDTO } from '../../types/dto';

class ListBankApi {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new BrokerSignupBaseApi().getInstance();
  }

  async getBanks():Promise<BankDTO[]> {
    const params: IHttpClientRequestParameters = {
      url: `/ms-bank-account-validator/api/bank`,
    };
    return await this.instance.get<BankDTO[]>(params);
  }
}

const listBankApi = new ListBankApi();
export default listBankApi;

import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import BrokerSignupBaseApi from '../BrokerSignupBaseApi';
import { BankDTO, ValidateBankAccountDTO } from '../../types/dto';
import { ValidateBankAccountRespondeModel } from '../../types/model';

class ListBankApi {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new BrokerSignupBaseApi().getInstance();
  }

  async getBanks(): Promise<BankDTO[]> {
    const params: IHttpClientRequestParameters = {
      url: `/ms-bank-account-validator/api/bank`,
    };
    return await this.instance.get<BankDTO[]>(params);
  }

  async validateBankAccount(
    validateBankAccount: ValidateBankAccountDTO,
  ): Promise<ValidateBankAccountRespondeModel> {
    const params: IHttpClientRequestParameters = {
      url: `/ms-bank-account-validator/api/bankAccount/basic`,
      payload: validateBankAccount,
    };
    return await this.instance.post<ValidateBankAccountRespondeModel>(params);
  }
}

const listBankApi = new ListBankApi();
export default listBankApi;

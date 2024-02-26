import {
  IHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import BrokerInssuanceBaseApi from '../BrokerIssuanceBaseApi';
import { InsuredSearchDTO } from '../../types/dto';
import { AddressSearchDTO } from '../../types/dto/AddressSearchDTO';
import { NewInsuredAddressDTO } from '../../types/dto/NewInsuredAddressDTO';

class InsuredSelectionApi {
  private readonly httpClient: IHttpClient;

  public constructor() {
    this.httpClient = new BrokerInssuanceBaseApi().getInstance();
  }

  searchInsured = async (search: string) => {
    const params: IHttpClientRequestParameters = {
      url: `/v1/insureds/search?query=${search}`,
    };
    return this.httpClient.get<InsuredSearchDTO>(params);
  };

  getAddressByZipcode = async (zipcode: string) => {
    const params: IHttpClientRequestParameters = {
      url: `/v1/insureds/address/${zipcode}`,
    };
    return this.httpClient.get<AddressSearchDTO>(params);
  };

  saveInsuredAddress = async (
    insuredId: number,
    city: string,
    uf: string,
    address: string,
  ) => {
    const params: IHttpClientRequestParameters = {
      url: `/v1/insureds/address`,
      payload: {
        insuredId,
        city,
        uf,
        address,
      },
    };
    return this.httpClient.post<NewInsuredAddressDTO>(params);
  };
}

export default new InsuredSelectionApi();

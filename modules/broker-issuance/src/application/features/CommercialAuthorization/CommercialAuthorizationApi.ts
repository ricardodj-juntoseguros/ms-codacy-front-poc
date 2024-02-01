import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import BrokerInssuanceBaseApi from '../BrokerIssuanceBaseApi';

class CommercialAuthorizationApi {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new BrokerInssuanceBaseApi().getInstance();
  }

  async postCommercialAuthorizationLetter(
    policyId: number,
    payload: FormData,
  ): Promise<any> {
    const params: IHttpClientRequestParameters = {
      url: `/v1/proposals/${policyId}/document/commercial-authorization-letter`,
      headers: { 'Content-Type': 'multipart/form-data' },
      payload,
    };
    return this.instance.post(params);
  }
}

export default new CommercialAuthorizationApi();

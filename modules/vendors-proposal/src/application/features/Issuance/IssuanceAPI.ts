import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import VendorsProposalBaseApi from '../VendorsProposalBaseApi';

class IssuanceAPI {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new VendorsProposalBaseApi().getInstance();
  }

  async submitToApproval(policyId: number): Promise<void> {
    const params: IHttpClientRequestParameters = {
      url: '/api/v1/issue',
      payload: { documentNumber: policyId },
    };

    return this.instance.post(params);
  }
}

export default new IssuanceAPI();

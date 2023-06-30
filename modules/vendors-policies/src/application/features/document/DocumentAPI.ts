import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import VendorsProposalBaseApi from '../VendorsPoliciesBaseApi';

class DocumentAPI {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new VendorsProposalBaseApi().getInstance();
  }

  async getPolicyDocument(policyId: number) {
    const params: IHttpClientRequestParameters = {
      url: `/api/v1/document/policy/${policyId}`,
    };
    return this.instance.get(params);
  }

  async getProposalDocuments(policyId: number) {
    const params: IHttpClientRequestParameters = {
      url: `/api/v1/document/policy/${policyId}/all`,
    };
    return this.instance.get(params);
  }
}

export default new DocumentAPI();

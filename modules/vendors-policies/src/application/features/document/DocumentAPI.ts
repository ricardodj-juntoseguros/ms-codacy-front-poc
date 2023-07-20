import { IHttpClientRequestParameters } from '@infrastructure/http-client';
import { getInstance } from '../VendorsPoliciesBaseApi';

class DocumentAPI {
  async getPolicyDocument(policyId: number) {
    const params: IHttpClientRequestParameters = {
      url: `/api/v1/document/policy/${policyId}`,
    };
    return getInstance().get(params);
  }

  async getProposalDocuments(policyId: number) {
    const params: IHttpClientRequestParameters = {
      url: `/api/v1/document/policy/${policyId}/all`,
    };
    return getInstance().get(params);
  }
}

export default new DocumentAPI();

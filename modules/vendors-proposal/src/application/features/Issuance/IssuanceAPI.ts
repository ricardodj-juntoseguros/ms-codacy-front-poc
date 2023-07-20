import { IHttpClientRequestParameters } from '@infrastructure/http-client';
import { getInstance } from '../VendorsProposalBaseApi';

class IssuanceAPI {
  async submitToApproval(policyId: number): Promise<void> {
    const params: IHttpClientRequestParameters = {
      url: '/api/v1/issue/SubmitToApproval',
      payload: { id: policyId },
    };

    return getInstance().post(params);
  }
}

export default new IssuanceAPI();

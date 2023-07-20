import { IHttpClientRequestParameters } from '@infrastructure/http-client';
import { getInstance } from '../VendorsProposalBaseApi';

class UploadDocumentAPI {
  async uploadDocument(proposalId: number, payload: FormData) {
    const params: IHttpClientRequestParameters = {
      url: `/api/v1/document/proposal/${proposalId}`,
      headers: { 'Content-Type': 'multipart/form-data' },
      payload,
    };

    return getInstance().post(params);
  }
}

export default new UploadDocumentAPI();

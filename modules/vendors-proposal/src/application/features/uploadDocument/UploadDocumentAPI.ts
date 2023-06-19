import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import VendorsProposalBaseApi from '../VendorsProposalBaseApi';

class UploadDocumentAPI {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new VendorsProposalBaseApi().getInstance();
  }

  async uploadDocument(proposalId: number, payload: FormData) {
    const params: IHttpClientRequestParameters = {
      url: '/api/v1/document/proposal',
      params: {
        proposalId,
      },
      headers: { 'Content-Type': 'multipart/form-data' },
      payload,
    };

    return this.instance.post(params);
  }
}

export default new UploadDocumentAPI();

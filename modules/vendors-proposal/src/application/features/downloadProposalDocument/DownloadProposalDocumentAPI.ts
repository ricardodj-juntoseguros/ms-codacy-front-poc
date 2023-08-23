import { IHttpClientRequestParameters } from '@infrastructure/http-client';
import { getInstance } from '../VendorsProposalBaseApi';

class DownloadProposalDocumentAPI {
  async getProposalDocument(proposalId: number) {
    const params: IHttpClientRequestParameters = {
      url: `/api/v1/document/proposal/${proposalId}`,
      headers: {
        Accept: 'application/pdf'
      },
      responseType: 'arraybuffer'
    };

    return getInstance().get(params);
  }
}

export default new DownloadProposalDocumentAPI();

import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import BrokerInssuanceBaseApi from '../BrokerIssuanceBaseApi';
import { InternalizeDocumentsDTO, ProposalDocumentDTO } from '../../types/dto';

class ProposalDocumentsApi {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new BrokerInssuanceBaseApi().getInstance();
  }

  async getProposalDocuments(policyId: number): Promise<ProposalDocumentDTO[]> {
    const params: IHttpClientRequestParameters = {
      url: `/v1/proposals/${policyId}/documents`,
    };
    return this.instance.get<ProposalDocumentDTO[]>(params);
  }

  async postProposalDocument(
    policyId: number,
    userType: number,
    payload: FormData,
  ): Promise<ProposalDocumentDTO> {
    const params: IHttpClientRequestParameters = {
      url: `/v1/proposals/${policyId}/documents`,
      params: { userType },
      headers: { 'Content-Type': 'multipart/form-data' },
      payload,
    };
    return this.instance.post(params);
  }

  async deleteProposalDocument(
    policyId: number,
    fieldname: string,
  ): Promise<void> {
    const params: IHttpClientRequestParameters = {
      url: `/v1/proposals/${policyId}/document/${fieldname}`,
    };
    return this.instance.delete(params);
  }

  async getProposalDocumentForDownload(proposalId: number) {
    const params: IHttpClientRequestParameters = {
      url: `/v1/proposals/${proposalId}/document/download`,
      headers: {
        Accept: 'application/pdf',
      },
      responseType: 'arraybuffer',
    };
    return this.instance.get(params);
  }

  async getDocumentsToInternalize(modalityId: number) {
    const params: IHttpClientRequestParameters = {
      url: `/v1/products/${modalityId}/internalize-documents`,
    };
    return this.instance.get<InternalizeDocumentsDTO[]>(params);
  }

  async deleteAllProposalDocuments(policyId: number) {
    const params: IHttpClientRequestParameters = {
      url: `/v1/proposals/${policyId}/documents`,
    };
    return this.instance.delete(params);
  }
}

export default new ProposalDocumentsApi();

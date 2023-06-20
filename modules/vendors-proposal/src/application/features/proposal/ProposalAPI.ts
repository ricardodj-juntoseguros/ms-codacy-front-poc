import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import VendorsProposalBaseApi from '../VendorsProposalBaseApi';
import { ProposalDTO } from '../../types/dto';
import { ProposalResultDTO } from '../../types/dto/ProposalResultDTO';

class ProposalAPI {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new VendorsProposalBaseApi().getInstance();
  }

  async createProposal(payload: ProposalDTO) {
    const params: IHttpClientRequestParameters = {
      url: '/api/v1/proposal',
      payload,
    };

    return this.instance.post<ProposalResultDTO>(params);
  }

  async updateProposal(policyId: number, payload: ProposalDTO) {
    const params: IHttpClientRequestParameters = {
      url: `/api/v1/proposal/${policyId}`,
      payload,
    };

    return this.instance.put<ProposalResultDTO>(params);
  }
}

export default new ProposalAPI();

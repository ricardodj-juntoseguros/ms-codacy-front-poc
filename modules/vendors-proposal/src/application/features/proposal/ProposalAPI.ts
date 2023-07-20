import { IHttpClientRequestParameters } from '@infrastructure/http-client';
import { ProposalDTO, UpdateProposalStatusDTO } from '../../types/dto';
import { ProposalResultDTO } from '../../types/dto/ProposalResultDTO';
import { getInstance } from '../VendorsProposalBaseApi';

class ProposalAPI {
  async createProposal(payload: ProposalDTO) {
    const params: IHttpClientRequestParameters = {
      url: '/api/v1/proposal',
      payload,
    };

    return getInstance().post<ProposalResultDTO>(params);
  }

  async updateProposal(proposalId: number, payload: ProposalDTO) {
    const params: IHttpClientRequestParameters = {
      url: `/api/v1/proposal/${proposalId}`,
      payload,
    };

    return getInstance().put<ProposalResultDTO>(params);
  }

  async updateProposalToAnalysis(proposalId: number) {
    const params: IHttpClientRequestParameters = {
      url: `/api/v1/proposal/${proposalId}/send-analysis`,
    };
    return getInstance().put<UpdateProposalStatusDTO>(params);
  }
}

export default new ProposalAPI();

import {
  IHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import LeaseBondsIssuanceBaseApi from '../LeaseBondsIssuanceBaseApi';
import {
  ProposalDTO,
  ProposalDraftDTO,
  ProposalResultDTO,
  ProposalResumeDTO,
  SubmitToApprovalOrIssuanceDTO,
  SubmitToApprovalOrIssuanceResultDTO,
} from '../../types/dto';

class ProposalApi {
  private readonly httpClient: IHttpClient;

  public constructor() {
    this.httpClient = new LeaseBondsIssuanceBaseApi().getInstance();
  }

  async putProposal(proposalId: number, proposalPayload: ProposalDTO) {
    const params: IHttpClientRequestParameters = {
      url: `/v1/proposals/${proposalId}`,
      payload: proposalPayload,
    };
    return await this.httpClient.put<ProposalResultDTO>(params);
  }

  async submitToApproval(newQuoterId: number, payload: SubmitToApprovalOrIssuanceDTO): Promise<SubmitToApprovalOrIssuanceResultDTO> {
    const params = {
      url: `/v1/proposals/${newQuoterId}/submitToApproval`,
      payload,
    };
    return this.httpClient.post<SubmitToApprovalOrIssuanceResultDTO>(params);
  }

  async getProposalResume(identification: number) {
    const params: IHttpClientRequestParameters = {
      url: `/v1/proposals/${identification}/details`,
      params: {
        format: 'resume',
      },
    };
    return await this.httpClient.get<ProposalResumeDTO>(params);
  }

  async getProposalDraft(policyId: number): Promise<ProposalDraftDTO> {
    const params: IHttpClientRequestParameters = {
      url: `/v1/proposals/${policyId}/draft`,
    };
    return await this.httpClient.get<ProposalDraftDTO>(params);
  };
}

export default new ProposalApi();

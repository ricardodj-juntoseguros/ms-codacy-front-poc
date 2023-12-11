import { IHttpClient, IHttpClientRequestParameters } from "@infrastructure/http-client";
import BrokerInssuanceBaseApi from "../BrokerIssuanceBaseApi";
import { ProposalDTO, ProposalResultDTO } from "../../types/dto";

class ProposalApi {
  private readonly httpClient: IHttpClient;

  public constructor() {
    this.httpClient = new BrokerInssuanceBaseApi().getInstance();
  }

  async putProposal(proposalId: number, proposalPayload: ProposalDTO) {
    const params: IHttpClientRequestParameters = {
      url: `/v1/proposals/${proposalId}`,
      payload: proposalPayload,
    };
    return await this.httpClient.put<ProposalResultDTO>(params);
  }
}

export default new ProposalApi();

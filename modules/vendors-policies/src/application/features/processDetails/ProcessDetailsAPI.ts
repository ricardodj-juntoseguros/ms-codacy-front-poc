import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import VendorsProposalBaseApi from '../VendorsPoliciesBaseApi';
import { ProcessDetailDTO } from '../../types/dto/ProcessDetailDTO';

class ProcessDetailsAPI {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new VendorsProposalBaseApi().getInstance();
  }

  async getProcessDetails(proposalId: number): Promise<ProcessDetailDTO> {
    const params: IHttpClientRequestParameters = {
      url: `/api/v1/proposal/${proposalId}`,
    };

    return this.instance.get(params);
  }
}

export default new ProcessDetailsAPI();

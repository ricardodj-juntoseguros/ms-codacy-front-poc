import { IHttpClientRequestParameters } from '@infrastructure/http-client';
import { getInstance } from '../VendorsPoliciesBaseApi';
import { ProcessDetailDTO } from '../../types/dto/ProcessDetailDTO';

class ProcessDetailsAPI {
  async getProcessDetails(proposalId: number): Promise<ProcessDetailDTO> {
    const params: IHttpClientRequestParameters = {
      url: `/api/v1/proposal/${proposalId}`,
    };

    return getInstance().get(params);
  }
}

export default new ProcessDetailsAPI();

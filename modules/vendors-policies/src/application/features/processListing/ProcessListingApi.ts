import { IHttpClientRequestParameters } from '@infrastructure/http-client';
import { ProposalListDTO } from '../../types/dto';
import { getInstance } from '../VendorsPoliciesBaseApi';

class ProcessListingApi {
  async getProcesses(page: number, pageSize: number): Promise<ProposalListDTO> {
    const params: IHttpClientRequestParameters = {
      url: '/api/v1/proposal',
      params: { page, pageSize },
    };

    return getInstance().get(params);
  }
}

export default new ProcessListingApi();

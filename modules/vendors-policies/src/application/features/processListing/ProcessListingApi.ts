import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import VendorsPoliciesBaseApi from '../VendorsPoliciesBaseApi';
import { ProposalListDTO } from '../../types/dto';

class ProcessListingApi {
  private instance: AxiosHttpClient;

  constructor() {
    this.instance = new VendorsPoliciesBaseApi().getInstance();
  }

  async getProcesses(page: number, pageSize: number): Promise<ProposalListDTO> {
    const params: IHttpClientRequestParameters = {
      url: '/api/v1/proposal',
      params: { page, pageSize },
    };

    return this.instance.get(params);
  }
}

export default new ProcessListingApi();

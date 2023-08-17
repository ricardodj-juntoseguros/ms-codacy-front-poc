import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';

import VendorsPreApprovalBaseApi from './PreApprovalBaseApi';
import PreApprovalDTO from '../types/dto/PreApprovalDTO';

class PreApprovalAPI {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new VendorsPreApprovalBaseApi().getInstance();
  }

  async getProposal(proposalId: number): Promise<any> {
    const params: IHttpClientRequestParameters = {
      url: `/api/v1/proposal/policy/${proposalId}`,
    };

    return this.instance.get<PreApprovalDTO>(params);
  }

  async refuseProposal(payload: any): Promise<any> {
    const params: IHttpClientRequestParameters = {
      url: `/api/v1/issue/refuse`,
      payload: { ...payload },
    };

    return this.instance.post(params);
  }

  async approveProposal(payload: any): Promise<any> {
    const params: IHttpClientRequestParameters = {
      url: `/api/v1/issue/approve`,
      payload: { ...payload },
      headers: { 'x-forwarded-for': '' },
    };

    return this.instance.post(params);
  }
}

export default new PreApprovalAPI();

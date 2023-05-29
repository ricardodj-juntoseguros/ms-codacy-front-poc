import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import VendorsProposalBaseApi from '../VendorsProposalBaseApi';
import { PolicyholderContactDTO } from '../../types/dto';

class PolicyholderContactAPI {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new VendorsProposalBaseApi().getInstance();
  }

  async getContacts(federalId: string): Promise<PolicyholderContactDTO[]> {
    const params: IHttpClientRequestParameters = {
      url: `/api/v1/policyholder/contacts`,
      params: { federalId },
    };

    return await this.instance.get<PolicyholderContactDTO[]>(params);
  }
}

export default new PolicyholderContactAPI();

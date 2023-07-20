import { IHttpClientRequestParameters } from '@infrastructure/http-client';
import { PolicyholderContactDTO } from '../../types/dto';
import { getInstance } from '../VendorsProposalBaseApi';

class PolicyholderContactAPI {
  async getContacts(federalId: string): Promise<PolicyholderContactDTO[]> {
    const params: IHttpClientRequestParameters = {
      url: `/api/v1/policyholder/contacts`,
      params: { federalId },
    };

    return await getInstance().get<PolicyholderContactDTO[]>(params);
  }

  async createContact(name: string, email: string, federalId: string) {
    const params: IHttpClientRequestParameters = {
      url: `/api/v1/policyholder/contacts`,
      payload: { name, email, federalId },
    };

    return getInstance().post(params);
  }
}

export default new PolicyholderContactAPI();

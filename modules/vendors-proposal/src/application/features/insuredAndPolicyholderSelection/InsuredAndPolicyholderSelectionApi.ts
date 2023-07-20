import { IHttpClientRequestParameters } from '@infrastructure/http-client';
import { getInstance } from '../VendorsProposalBaseApi';
import {
  InsuredAddressDTO,
  InsuredDTO,
  PolicyholderAffiliateDTO,
  PolicyholderDTO,
} from '../../types/dto';

class InsuredAndPolicyholderSelectionApi {
  async getInsuredList(): Promise<InsuredDTO[]> {
    const params: IHttpClientRequestParameters = {
      url: '/api/v1/insured',
    };

    return getInstance().get<InsuredDTO[]>(params);
  }

  async getInsuredAddresses(
    insuredFederalId: string,
  ): Promise<InsuredAddressDTO[]> {
    const params: IHttpClientRequestParameters = {
      url: '/api/v1/insured/addresses',
      params: {
        federalId: insuredFederalId,
      },
    };

    return getInstance().get<InsuredAddressDTO[]>(params);
  }

  async getPolicyholders(
    federalId?: string,
    corporateName?: string,
  ): Promise<PolicyholderDTO[]> {
    const params: IHttpClientRequestParameters = {
      url: '/api/v1/policyholder',
      params: {
        federalId,
        corporateName,
      },
    };
    return getInstance().get<PolicyholderDTO[]>(params);
  }

  async getPolicyholderAffiliates(
    policyholderFederalId: string,
  ): Promise<PolicyholderAffiliateDTO[]> {
    const params: IHttpClientRequestParameters = {
      url: '/api/v1/policyholder/affiliates',
      params: {
        federalId: policyholderFederalId,
      },
    };
    return getInstance().get<PolicyholderAffiliateDTO[]>(params);
  }
}

export default new InsuredAndPolicyholderSelectionApi();

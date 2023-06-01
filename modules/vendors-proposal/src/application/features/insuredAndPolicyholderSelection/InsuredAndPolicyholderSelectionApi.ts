import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import VendorsProposalBaseApi from '../VendorsProposalBaseApi';
import {
  InsuredAddressDTO,
  InsuredDTO,
  PolicyholderAffiliateDTO,
  PolicyholderDTO,
} from '../../types/dto';

class InsuredAndPolicyholderSelectionApi {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new VendorsProposalBaseApi().getInstance();
  }

  async getInsuredList(): Promise<InsuredDTO[]> {
    const params: IHttpClientRequestParameters = {
      url: '/api/v1/insured',
    };

    return this.instance.get<InsuredDTO[]>(params);
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

    return this.instance.get<InsuredAddressDTO[]>(params);
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
    return this.instance.get<PolicyholderDTO[]>(params);
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
    return this.instance.get<PolicyholderAffiliateDTO[]>(params);
  }
}

export default InsuredAndPolicyholderSelectionApi;

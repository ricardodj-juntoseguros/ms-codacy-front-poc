import { IHttpClientRequestParameters } from '@infrastructure/http-client';
import {
  InsuredDTO,
  PolicyholderDTO,
  ProposalListDTO,
  StatusFilterOptionDTO,
} from '../../types/dto';
import { getInstance } from '../VendorsPoliciesBaseApi';

class ProcessListingApi {
  async getProcesses(
    page: number,
    pageSize: number,
    identification?: string,
    status?: number,
    insuredFederalId?: string,
    policyholderFederalId?: string,
  ): Promise<ProposalListDTO> {
    const params: IHttpClientRequestParameters = {
      url: '/api/v1/proposal',
      params: {
        page,
        pageSize,
        identification,
        status,
        insuredFederalId,
        policyholderFederalId,
      },
    };

    return getInstance().get(params);
  }

  async getStatusFilterOptions(): Promise<StatusFilterOptionDTO[]> {
    const params: IHttpClientRequestParameters = {
      url: '/api/v1/proposal/filters/status',
    };
    return getInstance().get(params);
  }

  async getInsuredOptionsForInsuredUser(): Promise<InsuredDTO[]> {
    const params: IHttpClientRequestParameters = {
      url: '/api/v1/insured',
    };
    return getInstance().get<InsuredDTO[]>(params);
  }

  async getPolicyholderOptionsForInsuredUser(
    corporateName: string,
  ): Promise<PolicyholderDTO[]> {
    const params: IHttpClientRequestParameters = {
      url: '/api/v1/policyholder',
      params: {
        corporateName,
      },
    };
    return getInstance().get<PolicyholderDTO[]>(params);
  }
}

export default new ProcessListingApi();

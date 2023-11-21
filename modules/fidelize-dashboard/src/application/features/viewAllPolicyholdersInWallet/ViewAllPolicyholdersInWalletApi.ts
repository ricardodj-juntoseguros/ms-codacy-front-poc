import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import { BrokerPlatformAuthService } from '@services';
import { AllPolicyholdersInWalletDTO } from '../../types/dto';
import FidelizeDashboardBaseApi from '../FidelizeDashboardBaseApi';

class ViewAllPolicyholdersInWalletApi {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new FidelizeDashboardBaseApi().getPlataformaInstance();
  }

  async getAllPolicyholdersInWallet(): Promise<AllPolicyholdersInWalletDTO[]> {
    const userData = BrokerPlatformAuthService.getUserAccessCookie() || {
      broker: { externalId: 'Unknown', userId: 'Unknown' },
    };
    const params: IHttpClientRequestParameters = {
      url: `/policyholders/GetAllPolicyholderInWalletPerModality?withOpportunities=false&broker=${userData.broker.externalId}`,
    };

    return await this.instance.get<AllPolicyholdersInWalletDTO[]>(params);
  }
}

export default new ViewAllPolicyholdersInWalletApi();

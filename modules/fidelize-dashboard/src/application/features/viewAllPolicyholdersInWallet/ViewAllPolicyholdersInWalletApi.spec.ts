import { AxiosHttpClient } from '@infrastructure/http-client';
import { AllPolicyholdersInWalletDTO } from '../../types/dto';
import ViewAllPolicyholdersInWalletApi from './ViewAllPolicyholdersInWalletApi';

describe('ViewAllPolicyholdersInWalletApi', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_FIDELIZE_BFF_URL = 'any_url';
  });

  it('getAllPolicyholdersInWalletList should call bff service correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return [
          {
            policyholderExternalId: 2978,
            modalityExternalId: 122,
            policyholderFederalId: '71487374000121',
            policyholderName: 'Teste Tomador 1',
          },
        ] as AllPolicyholdersInWalletDTO[];
      });
    const result =
      await ViewAllPolicyholdersInWalletApi.getAllPolicyholdersInWallet();

    expect(mockGet).toHaveBeenCalledWith({
      url: '/policyholders/GetAllPolicyholderInWalletPerModality?withOpportunities=false&broker=Unknown',
    });

    expect(result[0].policyholderFederalId).toBe('71487374000121');
    expect(result[0].policyholderName).toBe('Teste Tomador 1');
  });
});

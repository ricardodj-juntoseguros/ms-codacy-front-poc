import { AxiosHttpClient } from '@infrastructure/http-client';
import CoverageApi from './CoverageApi';

describe('CoverageApi', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_BROKER_PLATFORM_BFF_URL = 'any_url';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getLimitCoverage should call bff service correctly', async () => {
    const mockData = {
      LimiteDisponivel: 100000,
      MensagemLimiteFlexibilizacao: '',
      MensagemLabelLimite: '',
      ExibirLimiteFlexibilizacao: '',
      ValorLimiteFlexibilizacao: ''
    };

    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return mockData;
      });

    const result = await CoverageApi.getLimitCoverage(1,1);

    expect(mockGet).toHaveBeenCalledWith({
      url: 'api/policyholders/1/balancelimit-policyholder?modalityExternalId=1',
    });
    expect(result).toBe(mockData);
  });
});

import {
  AxiosHttpClient,
  IHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import { InsuredDTO } from '../../types/dto/InsuredDTO';

class SearchInsuredApi {
  private readonly httpClient: IHttpClient;

  public constructor() {
    this.httpClient = new AxiosHttpClient(
      'https://ms-gateway-qas.juntoseguros.com/squad1/plataforma-preview-api/',
      {},
      100000,
    );
  }

  async searchInsured(insuredLabel: string) {
    const params: IHttpClientRequestParameters = {
      url: `/insured?insuredName=${insuredLabel}`,
    };
    return this.httpClient.get<InsuredDTO[]>(params);
  }
}

const searchInsuredApi = new SearchInsuredApi();
export default searchInsuredApi;

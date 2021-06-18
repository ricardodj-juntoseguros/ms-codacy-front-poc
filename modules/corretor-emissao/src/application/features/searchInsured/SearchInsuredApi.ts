import {
  AxiosHttpClient,
  IHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import { InsuredDTO } from '../../types/dto/InsuredDTO';

class SearchInsuredApi {
  private readonly httpClient: IHttpClient;

  public constructor() {
    this.httpClient = new AxiosHttpClient('http://localhost:4300', 100000);
  }

  async searchInsured(insuredLabel: string) {
    const params: IHttpClientRequestParameters = {
      url: `/insured?insuredLabel=${insuredLabel}`,
    };
    return this.httpClient.get<InsuredDTO[]>(params);
  }
}

const searchInsuredApi = new SearchInsuredApi();
export default searchInsuredApi;

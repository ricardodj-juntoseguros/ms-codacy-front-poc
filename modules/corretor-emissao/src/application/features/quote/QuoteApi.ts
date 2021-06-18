import {
  AxiosHttpClient,
  IHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import { QuoteResultDTO } from '../../types/dto/QuoteResultDTO';
import { TimeframeAndCoverageModel } from '../../types/model';

class QuoteApi {
  private readonly httpClient: IHttpClient;

  public constructor() {
    this.httpClient = new AxiosHttpClient('http://localhost:4300', 100000);
  }

  async generateQuote(rateData: TimeframeAndCoverageModel) {
    console.log(rateData);
    const params: IHttpClientRequestParameters = {
      url: '/generate-quote',
    };

    return await this.httpClient.get<QuoteResultDTO[]>(params);
  }
}

export default new QuoteApi();

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
    this.httpClient = new AxiosHttpClient(
      'https://ms-gateway-qas.juntoseguros.com/squad1/plataforma-preview-api/',
      100000,
    );
  }

  async generateQuote(rateData: TimeframeAndCoverageModel) {
    const params: IHttpClientRequestParameters = {
      url: '/generate-quote',
    };

    return await this.httpClient.post<QuoteResultDTO>(params);
  }
}

export default new QuoteApi();

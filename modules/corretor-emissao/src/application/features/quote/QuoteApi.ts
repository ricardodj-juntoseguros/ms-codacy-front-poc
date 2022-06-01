import {
  AxiosHttpClient,
  IHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import { QuoteDTO } from '../../types/dto/QuoteDTO';
import { QuoteResultDTO } from '../../types/dto/QuoteResultDTO';
import IssueBrokerBaseApi from '../IssueBrokerBaseApi';

class QuoteApi {
  private readonly httpClient: IHttpClient;

  public constructor() {
    this.httpClient = new IssueBrokerBaseApi().getInstance();
  }

  async generateQuote(quotePayload: QuoteDTO) {
    const params: IHttpClientRequestParameters = {
      url: 'ms-middleware-proposal/api/quotation',
      payload: quotePayload,
    };

    return await this.httpClient.post<QuoteResultDTO>(params);
  }
}

export default new QuoteApi();

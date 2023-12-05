import {
  IHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import { QuotationDTO } from '../../types/dto/QuotationDTO';
import { QuoteResultDTO } from '../../types/dto/QuoteResultDTO';
import BrokerIssuanceBaseApi from '../BrokerIssuanceBaseApi';

class QuoteApi {
  private readonly httpClient: IHttpClient;

  public constructor() {
    this.httpClient = new BrokerIssuanceBaseApi().getInstance();
  }

  async postQuotation(quotePayload: QuotationDTO) {
    const params: IHttpClientRequestParameters = {
      url: '/v1/quotation',
      payload: quotePayload,
    };
    return await this.httpClient.post<QuoteResultDTO>(params);
  }

  async putQuotation(proposalId: number, quotePayload: QuotationDTO) {
    const params: IHttpClientRequestParameters = {
      url: `/v1/quotation/${proposalId}`,
      payload: quotePayload,
    };
    return await this.httpClient.put<QuoteResultDTO>(params);
  }

  async getQuotationDocument(quotationId: number) {
    const params: IHttpClientRequestParameters = {
      url: `/v1/quotation/${quotationId}/document`,
      headers: {
        Accept: 'application/pdf',
      },
      responseType: 'arraybuffer',
    };
    return await this.httpClient.get<any>(params);
  }
}

export default new QuoteApi();

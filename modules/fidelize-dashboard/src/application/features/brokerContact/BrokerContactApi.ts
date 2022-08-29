import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import FidelizeDashboardBaseApi from '../FidelizeDashboardBaseApi';

class BrokerContactApi {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new FidelizeDashboardBaseApi().getInstance();
  }

  async sendBrokerContactLead(contactEmail: string, question: string) {
    const params: IHttpClientRequestParameters = {
      url: `/v1/contacts/leads`,
      payload: { leadEmails: [contactEmail], leadQuestion: question },
    };

    return await this.instance.post(params);
  }
}

export default new BrokerContactApi();

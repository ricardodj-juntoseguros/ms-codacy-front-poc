import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import VendorsAuthenticationBaseApi from '../VendorsAuthenticationBaseApi';
import { TermsDTO } from '../../types/dto';

class TermsApi {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new VendorsAuthenticationBaseApi().getInstance();
  }

  async getAcceptTerms(email: string, nameTerm: string): Promise<TermsDTO> {
    const params: IHttpClientRequestParameters = {
      url: `/api/v1/terms/byUserType?email=${email}&description=${nameTerm}`,
    };
    return await this.instance.get<TermsDTO>(params);
  }

  async getTerm(term: TermsDTO): Promise<string> {
    const version = term?.data[0].version;
    const nameTerm = term?.data[0].description;
    const params: IHttpClientRequestParameters = {
      url: `api/v1/terms?version=${version}&description=${nameTerm}`,
    };
    return await this.instance.get<string>(params);
  }

  async postAccept(email: string, termId: number) {
    const params: IHttpClientRequestParameters = {
      url: `/api/v1/terms/accept`,
      payload: {
        email,
        termId,
      },
    };
    return await this.instance.post(params);
  }
}

const authApi = new TermsApi();
export default authApi;

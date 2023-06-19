import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import VendorsProposalBaseApi from '../VendorsProposalBaseApi';
import { ModalityDTO } from '../../types/dto';

class ModalitySelectionAPI {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new VendorsProposalBaseApi().getInstance();
  }

  async getModalities(insuredFederalId: string): Promise<ModalityDTO[]> {
    const params: IHttpClientRequestParameters = {
      url: `/api/v1/products`,
      params: { insuredFederalId },
    };

    return await this.instance.get<ModalityDTO[]>(params);
  }
}

export default new ModalitySelectionAPI();

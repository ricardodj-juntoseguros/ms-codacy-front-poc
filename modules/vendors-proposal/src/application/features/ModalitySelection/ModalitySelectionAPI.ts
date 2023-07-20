import { IHttpClientRequestParameters } from '@infrastructure/http-client';
import { ModalityDTO } from '../../types/dto';
import { getInstance } from '../VendorsProposalBaseApi';

class ModalitySelectionAPI {
  async getModalities(insuredFederalId: string): Promise<ModalityDTO[]> {
    const params: IHttpClientRequestParameters = {
      url: `/api/v1/products`,
      params: { insuredFederalId },
    };

    return await getInstance().get<ModalityDTO[]>(params);
  }
}

export default new ModalitySelectionAPI();

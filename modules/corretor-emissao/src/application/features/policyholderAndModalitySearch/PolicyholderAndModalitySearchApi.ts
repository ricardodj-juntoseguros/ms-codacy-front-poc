import axios from 'axios';
import { ModalityDTO, PolicyholderDTO, SubsidiaryDTO } from '../../types/dto';

class PolicyholderAndModalitySearchApi {
  async searchPolicyHolder(policyHolderLabel: string) {
    return axios.get<PolicyholderDTO[]>(
      'http://localhost:3333/api/corretor-emissao',
      {
        params: { policyHolderLabel },
      },
    );
  }

  async getModalityByPolicyHolder(federalId: string) {
    return axios.get<ModalityDTO[]>(
      'http://localhost:3333/api/corretor-emissao',
      {
        params: { federalId },
      },
    );
  }

  async getSubsidiaryByPolicyHolder(federalId: string) {
    return axios.get<SubsidiaryDTO[]>(
      'http://localhost:3333/api/corretor-emissao',
      {
        params: { federalId },
      },
    );
  }
}

const policyholderAndModalitySearchApi = new PolicyholderAndModalitySearchApi();
export default policyholderAndModalitySearchApi;

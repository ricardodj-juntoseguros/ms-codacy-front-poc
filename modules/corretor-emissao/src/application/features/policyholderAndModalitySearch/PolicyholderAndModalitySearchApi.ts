import axios, { AxiosResponse } from 'axios';
import { ModalityDTO, PolicyholderDTO, SubsidiaryDTO } from '../../types/dto';

class PolicyholderAndModalitySearchApi {
  async searchPolicyHolder(policyHolderLabel: string) {
    return axios.get<PolicyholderDTO[]>('http://localhost:4300/policyholder', {
      params: { policyHolderLabel },
    });
  }

  async getModalityByPolicyHolder(federalId: string) {
    type policyholderModalitiesData = {
      federalId: string;
      modalityId: number;
    };

    const policyholderModalitiesData = await axios.get<
      policyholderModalitiesData[]
    >(`http://localhost:4300/policyholderModality`, {
      params: { federalId },
    });

    const policyholderModalities = await Promise.all(
      policyholderModalitiesData.data.map(policy => {
        return axios.get<ModalityDTO>(
          `http://localhost:4300/modality/${policy.modalityId}`,
        );
      }),
    );

    const responseMock: AxiosResponse<ModalityDTO[]> = {
      ...policyholderModalities[0],
      data: policyholderModalities.map(item => ({ ...item.data })),
    };

    return responseMock;
  }

  async getSubsidiaryByPolicyHolder(id: number) {
    return axios.get<SubsidiaryDTO[]>('http://localhost:4300/subsidiary', {
      params: { headquartersId: id },
    });
  }
}

const policyholderAndModalitySearchApi = new PolicyholderAndModalitySearchApi();
export default policyholderAndModalitySearchApi;

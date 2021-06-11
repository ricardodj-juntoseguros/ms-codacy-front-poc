import axios from 'axios';
import { InsuredDTO } from '../../types/dto/InsuredDTO';

class SearchInsuredApi {
  async searchInsured(insuredLabel: string) {
    return axios.get<InsuredDTO[]>('http://localhost:4300/insured', {
      params: { insuredLabel },
    });
  }
}

const searchInsuredApi = new SearchInsuredApi();
export default searchInsuredApi;

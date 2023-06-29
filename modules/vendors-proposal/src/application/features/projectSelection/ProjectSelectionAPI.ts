import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import VendorsProposalBaseApi from '../VendorsProposalBaseApi';
import { ProjectDTO } from '../../types/dto';

class ProjectSelectionAPI {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new VendorsProposalBaseApi().getInstance();
  }

  async getProjects(): Promise<ProjectDTO[]> {
    const params: IHttpClientRequestParameters = {
      url: `/api/v1/project`,
    };

    return await this.instance.get<ProjectDTO[]>(params);
  }

  async linkProject(
    projectSearchValue: string,
    projectId: string | null,
    policyId: number,
    insuredFederalId: string,
  ): Promise<void> {
    const params: IHttpClientRequestParameters = {
      url: `/api/v1/project/reference/policy/${policyId}`,
      payload: {
        useDefault: false,
        insuredFederalId,
        ...(projectId && { id: projectId }),
        ...(!projectId && { name: projectSearchValue }),
      },
    };

    return await this.instance.post(params);
  }
}

export default new ProjectSelectionAPI();

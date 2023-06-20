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

  async getProjects(name: string): Promise<ProjectDTO[]> {
    const params: IHttpClientRequestParameters = {
      url: `/api/v1/project`,
      params: { name },
    };

    return await this.instance.get<ProjectDTO[]>(params);
  }

  async linkProject(
    projectSearchValue: string,
    projectId: number | null,
    proposalId: number,
  ): Promise<void> {
    const params: IHttpClientRequestParameters = {
      url: `/api/v1/project`,
      payload: {
        ...(projectId && { id: projectId }),
        ...(!projectId && { name: projectSearchValue }),
        proposalId,
      },
    };

    return await this.instance.post(params);
  }
}

export default new ProjectSelectionAPI();

import { IHttpClientRequestParameters } from '@infrastructure/http-client';
import { ProjectDTO } from '../../types/dto';
import { getInstance } from '../VendorsProposalBaseApi';

class ProjectSelectionAPI {
  async getProjects(): Promise<ProjectDTO[]> {
    const params: IHttpClientRequestParameters = {
      url: `/api/v1/project`,
    };

    return await getInstance().get<ProjectDTO[]>(params);
  }

  async linkProject(
    projectSearchValue: string,
    projectId: string | null,
    policyId: number,
    insuredFederalId: string,
  ): Promise<{ policyExternalId: string }> {
    const params: IHttpClientRequestParameters = {
      url: `/api/v1/project/reference/policy/${policyId}`,
      payload: {
        useDefault: false,
        insuredFederalId,
        ...(projectId && { id: projectId }),
        ...(!projectId && { name: projectSearchValue }),
      },
    };

    return await getInstance().post(params);
  }
}

export default new ProjectSelectionAPI();

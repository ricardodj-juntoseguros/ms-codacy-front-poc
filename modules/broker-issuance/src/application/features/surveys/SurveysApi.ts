import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import BrokerInssuanceBaseApi from '../BrokerIssuanceBaseApi';
import { SurveyInviteDTO } from '../../types/dto';
import { SurveyTypeEnum } from '../../types/model';

class SurveysApi {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new BrokerInssuanceBaseApi().getInstance();
  }

  async getSurveyInvite(
    surveyType: SurveyTypeEnum,
    name: string,
  ): Promise<SurveyInviteDTO> {
    const params: IHttpClientRequestParameters = {
      url: `/v1/surveys/${surveyType}/invite`,
      params: {
        name,
      },
    };
    return this.instance.get<SurveyInviteDTO>(params);
  }

  async answerSurvey(
    surveyType: SurveyTypeEnum,
    inviteId: string,
    name: string,
    score: number,
    feedback: string | null,
  ) {
    const params: IHttpClientRequestParameters = {
      url: `/v1/surveys/${surveyType}/answer`,
      payload: {
        inviteId,
        name,
        score,
        feedback,
      },
    };
    return this.instance.post<any>(params);
  }
}

export default new SurveysApi();

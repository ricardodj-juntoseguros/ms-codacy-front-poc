import { AxiosHttpClient } from '@infrastructure/http-client';
import SurveysApi from './SurveysApi';
import { SurveyInviteDTO } from '../../types/dto';
import { SurveyTypeEnum } from '../../types/model';

describe('SurveysApi', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_ISSUER_PLATFORM_BFF = 'any_url';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getSurveyInvite should call bff service correctly for CSAT survey type', async () => {
    const mockData: SurveyInviteDTO = {
      inviteId: 'test_invite_id',
      shouldAnswer: true,
    };
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return mockData;
      });
    const result = await SurveysApi.getSurveyInvite(
      SurveyTypeEnum.CSAT,
      'broker',
    );

    expect(mockGet).toHaveBeenCalledWith({
      url: '/v1/surveys/csat/invite',
      params: {
        name: 'broker',
      },
    });
    expect(result).toStrictEqual(mockData);
  });

  it('answerSurvey should call bff service correctly for NPS survey type', async () => {
    const mockPost = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => {
        return { success: true };
      });
    const result = await SurveysApi.answerSurvey(
      SurveyTypeEnum.CSAT,
      'test_invite_id',
      'broker',
      5,
      'looks good to me',
    );
    expect(mockPost).toHaveBeenCalledWith({
      url: '/v1/surveys/csat/answer',
      payload: {
        inviteId: 'test_invite_id',
        name: 'broker',
        score: 5,
        feedback: 'looks good to me',
      },
    });
    expect(result.success).toBe(true);
  });
});

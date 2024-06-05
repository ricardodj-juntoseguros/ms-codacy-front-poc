import { renderHook } from '@testing-library/react-hooks';
import { Broker, BrokerPlatformAuthService } from '@services';
import SurveysApi from '../../../application/features/surveys/SurveysApi';
import { SurveyTypeEnum } from '../../../application/types/model';
import { useSurvey } from './useSurvey';

describe('UseSurvey Hook', () => {
  let getInviteMock: any = jest.fn();
  let answerMock: any = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    getInviteMock = jest
      .spyOn(SurveysApi, 'getSurveyInvite')
      .mockImplementation(async () => {
        return { inviteId: '145ceb91ad3746dbb6b3', shouldAnswer: true };
      });
    answerMock = jest
      .spyOn(SurveysApi, 'answerSurvey')
      .mockImplementation(async () => {
        return 'Ok';
      });
    jest
      .spyOn(BrokerPlatformAuthService, 'getBroker')
      .mockImplementation(() => {
        return {
          name: 'Teste corretor',
        } as Broker;
      });
  });

  it('getSurveyInvite callback should call api and set values correctly', async () => {
    const { result } = renderHook(() => useSurvey(SurveyTypeEnum.CSAT));
    const getSurveyInvite = result.current[2];
    await getSurveyInvite();
    const shouldAnswer = result.current[0];
    const surveyData = result.current[1];
    expect(shouldAnswer).toBe(true);
    expect(getInviteMock).toHaveBeenLastCalledWith(
      SurveyTypeEnum.CSAT,
      'Teste corretor',
    );
    expect(surveyData.title).toEqual(
      'Como você avalia a sua experiência no novo fluxo de emissão?',
    );
  });

  it('shouldAnswer should be false if api fails', async () => {
    jest.spyOn(SurveysApi, 'getSurveyInvite').mockImplementation(async () => {
      return Promise.reject();
    });
    const { result } = renderHook(() => useSurvey(SurveyTypeEnum.CSAT));
    const getSurveyInvite = result.current[2];
    await getSurveyInvite();
    const shouldAnswer = result.current[0];
    expect(shouldAnswer).toBe(false);
  });

  it('answerSurvey callback should call api and set values correctly', async () => {
    const { result, waitFor } = renderHook(() =>
      useSurvey(SurveyTypeEnum.CSAT),
    );
    const getSurveyInvite = result.current[2];

    await getSurveyInvite();
    await waitFor(() => {
      const shouldAnswer = result.current[0];
      const surveyData = result.current[1];
      expect(shouldAnswer).toBe(true);
      expect(surveyData.title).toEqual(
        'Como você avalia a sua experiência no novo fluxo de emissão?',
      );
    });

    const answerSurvey = result.current[3];
    await answerSurvey(5, 'Ok');
    expect(answerMock).toHaveBeenLastCalledWith(
      SurveyTypeEnum.CSAT,
      '145ceb91ad3746dbb6b3',
      'Teste corretor',
      5,
      'Ok',
    );
  });
});

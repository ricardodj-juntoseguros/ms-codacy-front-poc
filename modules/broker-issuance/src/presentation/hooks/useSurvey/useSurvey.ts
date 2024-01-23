import { useCallback, useMemo, useState } from 'react';
import { makeToast } from 'junto-design-system';
import { BrokerPlatformAuthService } from '@services';
import { SurveyTypeEnum } from '../../../application/types/model';
import SurveysApi from '../../../application/features/surveys/SurveysApi';
import { SURVEYS_DATA } from '../../../constants';

export function useSurvey(surveyType: SurveyTypeEnum) {
  const [inviteId, setInviteId] = useState<string>();
  const [shouldAnswer, setShouldAnswer] = useState<boolean>(false);
  const broker = BrokerPlatformAuthService.getBroker();

  const componentData = useMemo(() => {
    return SURVEYS_DATA[surveyType];
  }, [surveyType]);

  const getSurveyInvite = useCallback(async () => {
    if (!broker) return;
    SurveysApi.getSurveyInvite(surveyType, broker.name)
      .then(({ inviteId, shouldAnswer }) => {
        setInviteId(inviteId);
        setShouldAnswer(shouldAnswer);
      })
      .catch(() => {
        setInviteId(undefined);
        setShouldAnswer(false);
      });
  }, [surveyType, broker]);

  const answerSurvey = useCallback(
    async (score: number, feedback: string) => {
      if (!broker || !inviteId || !shouldAnswer) return;
      SurveysApi.answerSurvey(
        surveyType,
        inviteId,
        broker.name,
        score,
        feedback,
      )
        .catch(() => {
          makeToast('error', 'Ops! Ocorreu um erro ao enviar a sua avaliação.');
        })
        .finally(() => {
          setInviteId(undefined);
        });
    },
    [shouldAnswer, inviteId, broker, surveyType],
  );

  return [shouldAnswer, componentData, getSurveyInvite, answerSurvey] as const;
}

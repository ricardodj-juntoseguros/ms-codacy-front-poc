import { SurveyTypeEnum } from '../application/types/model';

export const SURVEYS_DATA = {
  [SurveyTypeEnum.CSAT]: {
    title: 'Como você avalia a sua experiência no novo fluxo de emissão?',
    modalTitle: 'Conta para gente o que motivou essa nota',
    finishMessageTitle: 'Agradecemos a sua participação.',
    finishMessage: 'Sua opinião é importante para nós.',
    placeholderForScoreEqualOrBelowThree:
      'Como foi sua experiência no novo fluxo?',
    placeholderForScoreEqualOrGreaterThanFour:
      'Como foi sua experiência no novo fluxo?',
  },
  [SurveyTypeEnum.NPS_DIRECT]: {
    title:
      'Qual a probabilidade de você recomendar a Junto Seguros a um amigo ou parceiro?',
    subtitles: undefined,
  },
  [SurveyTypeEnum.NPS_INTERNALIZED]: {
    title:
      'Qual a probabilidade de você recomendar a Junto Seguros a um amigo ou parceiro?',
    subtitles: undefined,
  },
};

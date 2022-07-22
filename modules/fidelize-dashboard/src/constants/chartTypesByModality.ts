import { ModalityEnum, SummaryChartTypeEnum } from '../application/types/model';

export const CHART_TYPES_BY_MODALITY = [
  {
    modality: ModalityEnum.FISCAL,
    chartTypes: [
      SummaryChartTypeEnum.SUBSTITUTION,
      SummaryChartTypeEnum.RENEWAL,
      SummaryChartTypeEnum.NEW_ISSUE,
    ],
  },
  {
    modality: ModalityEnum.TRABALHISTA,
    chartTypes: [
      SummaryChartTypeEnum.SUBSTITUTION,
      SummaryChartTypeEnum.RENEWAL,
      SummaryChartTypeEnum.NEW_ISSUE,
    ],
  },
  { modality: ModalityEnum.CIVIL, chartTypes: [] },
];

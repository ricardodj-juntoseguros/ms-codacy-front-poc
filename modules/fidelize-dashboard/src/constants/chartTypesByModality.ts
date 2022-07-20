import { ModalityEnum, SummaryChartTypeEnum } from '../application/types/model';

export const CHART_TYPES_BY_MODALITY = [
  {
    modality: ModalityEnum.FISCAL,
    chartTypes: [
      SummaryChartTypeEnum.SUBSTITUTION,
      SummaryChartTypeEnum.RENEWAL,
      SummaryChartTypeEnum.NEW_ISSUES,
    ],
  },
  {
    modality: ModalityEnum.TRABALHISTA,
    chartTypes: [SummaryChartTypeEnum.RENEWAL],
  },
  { modality: ModalityEnum.CIVIL, chartTypes: [] },
];

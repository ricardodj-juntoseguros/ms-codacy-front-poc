import { ModalityEnum, SummaryChartTypeEnum } from '../application/types/model';

export const CHART_TYPES_BY_MODALITY = [
  {
    modality: ModalityEnum.FISCAL,
    chartTypes: [SummaryChartTypeEnum.SUBSTITUTION, SummaryChartTypeEnum.RENEWAL],
  },
  { modality: ModalityEnum.TRABALHISTA, chartTypes: [] },
  { modality: ModalityEnum.CIVIL, chartTypes: [] },
];

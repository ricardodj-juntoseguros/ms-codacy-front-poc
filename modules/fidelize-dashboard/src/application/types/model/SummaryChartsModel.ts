import { SummaryChartDataDTO } from '../dto';
import { ModalityEnum } from './ModalityEnum';
import { SummaryChartTypeEnum } from './SummaryChartTypeEnum';

export interface SummaryChartsModel {
  charts: {
    modality: ModalityEnum;
    chartType: SummaryChartTypeEnum;
    loading: boolean;
    error: boolean;
    data?: SummaryChartDataDTO | null;
  }[];
}

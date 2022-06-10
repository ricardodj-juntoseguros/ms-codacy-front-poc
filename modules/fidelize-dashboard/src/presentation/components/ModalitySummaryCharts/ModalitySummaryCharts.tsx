import SummaryChart from '../SummaryChart';
import { ModalityEnum } from '../../../application/types/model';
import { CHART_TYPES_BY_MODALITY } from '../../../constants';
import styles from './ModalitySummaryCharts.module.scss';

interface ModalitySummaryChartsProps {
  modality: ModalityEnum;
}

const ModalitySummaryCharts: React.FC<ModalitySummaryChartsProps> = ({
  modality,
}) => {
  const chartTypes =
    CHART_TYPES_BY_MODALITY.find(each => each.modality === modality)
      ?.chartTypes || [];

  if (chartTypes.length === 0) return null;
  return (
    <div className={styles['modality-summary-charts__wrapper']}>
      {chartTypes.map(type => (
        <div
          key={`chart-${modality}-${type}`}
          data-testid={`chart-${modality}-${type}-wrapper`}
        >
          <SummaryChart modality={modality} chartType={type} />
        </div>
      ))}
    </div>
  );
};

export default ModalitySummaryCharts;

import { thousandSeparator, thousandTextFormatter } from '@shared/utils';
import { nanoid } from 'nanoid';
import { SummaryChartDataDTO } from '../../../application/types/dto';
import styles from './SummaryChartCustomTooltip.module.scss';

interface SummaryChartCustomTooltipProps {
  options: { dataPointIndex: number; series: any };
  chartData: SummaryChartDataDTO;
}

const SummaryChartCustomTooltip: React.FC<SummaryChartCustomTooltipProps> = ({
  options,
  chartData,
}) => {
  const { dataPointIndex, series } = options;
  const {
    tooltip: { labels },
    series: dataSeries,
  } = chartData;
  const data = series.map((s: number[]) => s[dataPointIndex]);
  document
    .querySelectorAll('.apexcharts-tooltip')
    .forEach(el =>
      el.classList.add(
        styles['summary-chart-custom-tooltip__apexchart-wrapper'],
      ),
    );
  return (
    <div className={styles['summary-chart-custom-tooltip__wrapper']}>
      <div className={styles['summary-chart-custom-tooltip__content']}>
        <p className={styles['summary-chart-custom-tooltip_title']}>
          {labels[dataPointIndex]}
        </p>
        {dataSeries.map((dataSerie, index) => {
          const {
            values: { color, name },
            metadata: {
              preffix,
              suffix,
              legend: { useThousandFormatter, useThousandSeparator },
            },
          } = dataSerie;

          let value = data[index];
          if (useThousandFormatter)
            value = thousandTextFormatter(value, '', '', 'short');
          if (useThousandSeparator) value = thousandSeparator(value);
          return (
            <p
              key={`tooltip-data$-${nanoid(5)}`}
              className={styles['summary-chart-custom-tooltip__data']}
            >
              <span style={{ backgroundColor: color }} />
              {preffix ? `${preffix} ` : ''}
              {value}
              {suffix ? `${suffix} ` : ''} {name}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default SummaryChartCustomTooltip;

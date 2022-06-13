import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { renderToString } from 'react-dom/server';
import { thousandSeparator, thousandTextFormatter } from '@shared/utils';
import classNames from 'classnames';
import {
  ModalityEnum,
  SummaryChartTypeEnum,
} from '../../../application/types/model';
import { SummaryChartDataDTO } from '../../../application/types/dto';
import {
  fetchChartData,
  selectChartData,
} from '../../../application/features/summaryCharts/SummaryChartsSlice';
import { selectPolicyholderSelection } from '../../../application/features/policyholderFilter/PolicyholderFilterSlice';
import { CHART_OPTIONS } from '../../../constants';
import { SummaryChartSkeleton } from '../Skeletons';
import { getLabelByModality } from '../../../helpers';
import SummaryChartCustomTooltip from '../SummaryChartCustomTooltip';
import { ReactComponent as EmptyIllustration } from './assets/empty-chart.svg';
import { ReactComponent as UnderConstructionIllustration } from '../../assets/under-construction.svg';
import styles from './SummaryChart.module.scss';

interface SummaryChartProps {
  modality: ModalityEnum;
  chartType: SummaryChartTypeEnum;
}

const SummaryChart: React.FC<SummaryChartProps> = ({ modality, chartType }) => {
  const dispatch = useDispatch();
  const chartData = useSelector(selectChartData(modality, chartType));
  const filteredPolicyholders = useSelector(selectPolicyholderSelection);

  useEffect(() => {
    if (!chartData?.data && chartType !== SummaryChartTypeEnum.NEW_ISSUES) {
      dispatch(
        fetchChartData({
          modality,
          chartType,
          federalids: filteredPolicyholders,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, modality, chartType, chartData?.data]);

  const getChartTypeLabel = (type: SummaryChartTypeEnum) => {
    switch (type) {
      case SummaryChartTypeEnum.RENEWAL:
        return 'Renovações';
      case SummaryChartTypeEnum.SUBSTITUTION:
        return 'Substituições';
      case SummaryChartTypeEnum.NEW_ISSUES:
        return 'Novas emissões';
      default:
        return '';
    }
  };

  const getLegendFormatter = (data: SummaryChartDataDTO) => {
    const { series } = data;
    return (seriesName: string, { seriesIndex }: any) => {
      const {
        metadata: {
          legend: { totalizer, useThousandFormatter, useThousandSeparator },
          preffix,
          suffix,
        },
      } = series[seriesIndex];
      let value = totalizer.toString();
      if (useThousandFormatter)
        value = thousandTextFormatter(
          totalizer,
          `${preffix} `,
          suffix,
          'short',
        );
      if (useThousandSeparator) value = thousandSeparator(totalizer) || '';
      return `<strong>${value}</strong><br>${seriesName}`;
    };
  };

  const getChartCustomTooltip = (options: any, data: SummaryChartDataDTO) => {
    return renderToString(
      <SummaryChartCustomTooltip options={options} chartData={data} />,
    );
  };

  const getChartOptions = (data: SummaryChartDataDTO) => {
    const { categories, series } = data;
    const options = {
      ...CHART_OPTIONS,
      chart: {
        ...CHART_OPTIONS.chart,
        id: `${modality}-${chartType}-chart`,
      },
      xaxis: { ...CHART_OPTIONS.xaxis, categories },
    } as ApexOptions;
    options.yaxis = options.yaxis as ApexYAxis[];
    options.yaxis.forEach((each, index) => {
      each.seriesName = series[index].values.name;
      if (series[index].metadata.useThousandFormatter && each.labels) {
        each.labels.formatter = v => thousandTextFormatter(v, '', '', 'short');
      }
    });
    options.tooltip = {
      ...options.tooltip,
      custom: options => getChartCustomTooltip(options, data),
    };
    options.legend = {
      ...options.legend,
      formatter: getLegendFormatter(data),
    };
    return options;
  };

  const getChartSeries = (data: SummaryChartDataDTO) => {
    const { series } = data;
    return series.map(serie => serie.values);
  };

  const renderError = () => {
    return (
      <div
        className={classNames(
          styles['summary-chart__message'],
          styles['summary-chart__message--error'],
        )}
      >
        <div>
          <i className="icon-x-circle" />
          <p>Ocorreu um erro inesperado. Tente novamente mais tarde.</p>
        </div>
        <EmptyIllustration />
      </div>
    );
  };

  const renderNoData = () => {
    return (
      <div
        className={classNames(
          styles['summary-chart__message'],
          styles['summary-chart__message--empty'],
        )}
      >
        <div>
          <i className="icon-bar-chart" />
          <p>Dados zerados ou inexistentes para esse tipo de oportunidade.</p>
        </div>
        <EmptyIllustration />
      </div>
    );
  };

  const renderNotAvailable = () => {
    return (
      <div className={styles['summary-chart__not-available']}>
          <UnderConstructionIllustration />
          <p>Tipo de oportunidade em construção</p>
      </div>
    );
  };

  const contentTitle = (
    <h3 className={styles['summary-chart__title']}>
      {getLabelByModality(modality, getChartTypeLabel(chartType), true, false)}
    </h3>
  );

  const renderContent = () => {
    if (!chartData) return null;
    const { error, loading, data } = chartData;
    if (loading) return <SummaryChartSkeleton />;
    if (error)
      return (
        <>
          {contentTitle}
          {renderError()}
        </>
      );
    if (!data) return null;
    if (chartType === SummaryChartTypeEnum.NEW_ISSUES) {
      return (
        <>
          {contentTitle}
          {renderNotAvailable()}
        </>
      );
    }
    if (data.series.every(s => s.values.data.every(data => data === 0))) {
      return (
        <>
          {contentTitle}
          {renderNoData()}
        </>
      );
    }
    return (
      <>
        {contentTitle}
        <ReactApexChart
          height={276}
          width={305}
          options={getChartOptions(data)}
          series={getChartSeries(data)}
        />
      </>
    );
  };

  return (
    <div className={styles['summary-chart__wrapper']}>{renderContent()}</div>
  );
};

export default SummaryChart;

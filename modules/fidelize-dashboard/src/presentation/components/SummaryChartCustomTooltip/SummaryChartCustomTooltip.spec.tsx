import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SummaryChartDataDTO } from '../../../application/types/dto';
import SummaryChartCustomTooltip from './SummaryChartCustomTooltip';

describe('SummaryChartCustomTooltip', () => {
  it('Should render correctly with given props', () => {
    const mockOptions = {
      dataPointIndex: 2,
      series: [
        [10, 20, 30, 40],
        [100, 200, 300, 400],
      ],
    };
    const mockChartData: SummaryChartDataDTO = {
      series: [
        {
          values: {
            name: 'Oportunidades',
            type: 'column',
            color: '#9000ff',
            data: [10, 20, 30, 40],
          },
          metadata: {
            useThousandFormatter: true,
            preffix: '',
            suffix: '',
            legend: {
              useThousandFormatter: false,
              useThousandSeparator: true,
              totalizer: 100,
            },
          },
        },
        {
          values: {
            name: 'Em IS',
            type: 'line',
            color: '#180a33',
            data: [100, 200, 300, 400],
          },
          metadata: {
            useThousandFormatter: true,
            preffix: 'R$',
            suffix: '',
            legend: {
              useThousandFormatter: true,
              useThousandSeparator: false,
              totalizer: 1000,
            },
          },
        },
      ],
      categories: [],
      tooltip: {
        labels: [
          'Primeira label',
          'Segunda label',
          'Terceira label',
          'QuartalLabel',
        ],
      },
    };

    const { getByText } = render(
      <SummaryChartCustomTooltip
        options={mockOptions}
        chartData={mockChartData}
      />,
    );

    expect(getByText('Terceira label')).toBeInTheDocument();
    expect(getByText('30 Oportunidades')).toBeInTheDocument();
    expect(getByText('R$ 300 Em IS')).toBeInTheDocument();
  });
});

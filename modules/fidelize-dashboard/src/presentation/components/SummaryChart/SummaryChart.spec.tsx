import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';
import { SummaryChartDataDTO } from '../../../application/types/dto';
import { summaryChartsActions } from '../../../application/features/summaryCharts/SummaryChartsSlice';
import {
  ModalityEnum,
  SummaryChartTypeEnum,
} from '../../../application/types/model';
import SummaryChartsApi from '../../../application/features/summaryCharts/SummaryChartsApi';
import SummaryChart from './SummaryChart';
import { store } from '../../../config/store';

const renewalMock: SummaryChartDataDTO = {
  series: [
    {
      values: {
        name: 'oportunidades',
        type: 'column',
        color: '#9000ff',
        data: [100, 200, 300, 400],
      },
      metadata: {
        useThousandFormatter: true,
        preffix: '',
        suffix: '',
        legend: {
          useThousandFormatter: false,
          useThousandSeparator: true,
          totalizer: 1000,
        },
      },
    },
    {
      values: {
        name: 'em IS',
        type: 'line',
        color: '#180a33',
        data: [10000, 20000, 30000, 40000],
      },
      metadata: {
        useThousandFormatter: true,
        preffix: 'R$',
        suffix: '',
        legend: {
          useThousandFormatter: true,
          useThousandSeparator: false,
          totalizer: 100000,
        },
      },
    },
  ],
  categories: [
    ['Inferior', 'a 60'],
    ['61 a 90', 'dias'],
    ['91 a 180', 'dias'],
    ['Superior', 'a 180'],
  ],
  tooltip: {
    labels: [
      'Apólice com vencimento inferior a 60 dias',
      'Apólice com vencimento de 61 a 90 dias',
      'Apólice com vencimento de 91 a 180 dias',
      'Apólice com vencimento superior a 180 dias',
    ],
  },
};

const substitutionMock: SummaryChartDataDTO = {
  series: [
    {
      values: {
        name: 'oportunidades',
        type: 'column',
        color: '#9000ff',
        data: [100, 200, 300, 400],
      },
      metadata: {
        useThousandFormatter: true,
        preffix: '',
        suffix: '',
        legend: {
          useThousandFormatter: false,
          useThousandSeparator: true,
          totalizer: 1000,
        },
      },
    },
    {
      values: {
        name: 'em IS',
        type: 'line',
        color: '#180a33',
        data: [10000, 20000, 30000, 40000],
      },
      metadata: {
        useThousandFormatter: true,
        preffix: 'R$',
        suffix: '',
        legend: {
          useThousandFormatter: true,
          useThousandSeparator: false,
          totalizer: 100000,
        },
      },
    },
  ],
  categories: [
    ['Penhora'],
    ['Fiança'],
    ['Depósito'],
    ['Bloqueio', 'de Conta'],
  ],
  tooltip: {
    labels: [
			"Penhora",
			"Fiança Bancária",
			"Depósito Judicial",
			"Bloqueio de Conta"
		]
  },
};

const emptyMock: SummaryChartDataDTO = {
  series: [
    {
      values: {
        name: 'oportunidades',
        type: 'column',
        color: '#9000ff',
        data: [0, 0, 0, 0],
      },
      metadata: {
        useThousandFormatter: true,
        preffix: '',
        suffix: '',
        legend: {
          useThousandFormatter: false,
          useThousandSeparator: true,
          totalizer: 0,
        },
      },
    },
    {
      values: {
        name: 'em IS',
        type: 'line',
        color: '#180a33',
        data: [0, 0, 0, 0],
      },
      metadata: {
        useThousandFormatter: true,
        preffix: 'R$',
        suffix: '',
        legend: {
          useThousandFormatter: true,
          useThousandSeparator: false,
          totalizer: 0,
        },
      },
    },
  ],
  categories: [
    ['Inferior', 'a 60'],
    ['61 a 90', 'dias'],
    ['91 a 180', 'dias'],
    ['Superior', 'a 180'],
  ],
  tooltip: {
    labels: [
      'Apólice com vencimento inferior a 60 dias',
      'Apólice com vencimento de 61 a 90 dias',
      'Apólice com vencimento de 91 a 180 dias',
      'Apólice com vencimento superior a 180 dias',
    ],
  },
};

jest.mock('react-apexcharts', () => ({
  __esModule: true,
  default: () => {
    return <div />;
  },
}));

describe('SummaryChart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    store.dispatch(summaryChartsActions.clearAllChartsData());
  });

  it('Should render correctly for renewal type chart', async () => {
    jest
      .spyOn(SummaryChartsApi, 'getChartData')
      .mockImplementation(async () => {
        return renewalMock;
      });

    const { container, findByText } = render(
      <Provider store={store}>
        <SummaryChart
          modality={ModalityEnum.FISCAL}
          chartType={SummaryChartTypeEnum.RENEWAL}
        />
      </Provider>,
    );
    expect(container).toBeInTheDocument();
    expect(await findByText('Renovações fiscais')).toBeInTheDocument();
  });

  it('Should render correctly for substitution type chart', async () => {
    jest
      .spyOn(SummaryChartsApi, 'getChartData')
      .mockImplementation(async () => {
        return renewalMock;
      });

    const { container, findByText } = render(
      <Provider store={store}>
        <SummaryChart
          modality={ModalityEnum.FISCAL}
          chartType={SummaryChartTypeEnum.SUBSTITUTION}
        />
      </Provider>,
    );
    expect(container).toBeInTheDocument();
    expect(await findByText('Substituições fiscais')).toBeInTheDocument();
  });

  it('Should render placeholder if chart data is all empty', async () => {
    jest
      .spyOn(SummaryChartsApi, 'getChartData')
      .mockImplementation(async () => {
        return emptyMock;
      });

    const { container, findByText } = render(
      <Provider store={store}>
        <SummaryChart
          modality={ModalityEnum.FISCAL}
          chartType={SummaryChartTypeEnum.RENEWAL}
        />
      </Provider>,
    );
    expect(container).toBeInTheDocument();
    expect(await findByText('Renovações fiscais')).toBeInTheDocument();
    expect(
      await findByText(
        'Dados zerados ou inexistentes para esse tipo de oportunidade.',
      ),
    ).toBeInTheDocument();
  });

  it('Should render error placeholder if chart data fetched with error', async () => {
    jest
      .spyOn(SummaryChartsApi, 'getChartData')
      .mockImplementation(async () => {
        return new Promise((resolve, reject) => {
          reject();
        });
      });

    const { container, findByText } = render(
      <Provider store={store}>
        <SummaryChart
          modality={ModalityEnum.FISCAL}
          chartType={SummaryChartTypeEnum.RENEWAL}
        />
      </Provider>,
    );
    expect(container).toBeInTheDocument();
    expect(await findByText('Renovações fiscais')).toBeInTheDocument();
    expect(
      await findByText(
        'Ocorreu um erro inesperado. Tente novamente mais tarde.',
      ),
    ).toBeInTheDocument();
  });
});

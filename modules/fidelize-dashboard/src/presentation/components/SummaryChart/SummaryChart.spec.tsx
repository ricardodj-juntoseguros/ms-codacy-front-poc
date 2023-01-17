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

const substitutionMock = (modality: ModalityEnum): SummaryChartDataDTO => {
  const categories =
    modality === ModalityEnum.LABOR
      ? [['Ordinário'], ['Revista'], ['Agravo', 'de Inst.'], ['Execução']]
      : [['Penhora'], ['Fiança'], ['Depósito'], ['Bloqueio', 'de Conta']];

  const tooltipLabels =
    modality === ModalityEnum.LABOR
      ? [
          'Recurso Ordinário',
          'Recurso de Revista',
          'Agravo de Instrumento',
          'Execução',
        ]
      : [
          'Penhora',
          'Fiança Bancária',
          'Depósito Judicial',
          'Bloqueio de Conta',
        ];

  return {
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
    categories,
    tooltip: {
      labels: tooltipLabels,
    },
  };
};

const newIssueMock: SummaryChartDataDTO = {
  series: [
    {
      values: {
        name: 'oportunidades',
        type: 'column',
        color: '#9000ff',
        data: [211, 946, 383, 7474],
      },
      metadata: {
        useThousandFormatter: true,
        preffix: '',
        suffix: '',
        legend: {
          useThousandFormatter: false,
          useThousandSeparator: true,
          totalizer: 9014,
        },
      },
    },
    {
      values: {
        name: 'em IS aproximada',
        type: 'line',
        color: '#180a33',
        data: [5733873.97, 31392728.33, 11744199.61, 272582976.63],
      },
      metadata: {
        useThousandFormatter: true,
        preffix: 'R$',
        suffix: '',
        legend: {
          useThousandFormatter: true,
          useThousandSeparator: false,
          totalizer: 321453778.54,
        },
      },
    },
  ],
  categories: [
    ['Imedi', 'ato'],
    ['Semanas', ''],
    ['Meses', ''],
    ['Indetermi', 'nado'],
  ],
  tooltip: {
    labels: [
      'Iminência imediata (de 1 a 30 dias)',
      'Iminência de semanas (de 31 a 90 dias)',
      'Iminência de meses (91 a 180 dias)',
      'Iminência indeterminada',
    ],
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

  it('Should render correctly for fiscal modality and renewal type chart', async () => {
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

  it('Should render correctly for fiscal modality and substitution type chart', async () => {
    jest
      .spyOn(SummaryChartsApi, 'getChartData')
      .mockImplementation(async () => {
        return substitutionMock(ModalityEnum.FISCAL);
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

  it('Should render correctly for labor modality and renewal type chart', async () => {
    jest
      .spyOn(SummaryChartsApi, 'getChartData')
      .mockImplementation(async () => {
        return renewalMock;
      });

    const { container, findByText } = render(
      <Provider store={store}>
        <SummaryChart
          modality={ModalityEnum.LABOR}
          chartType={SummaryChartTypeEnum.RENEWAL}
        />
      </Provider>,
    );
    expect(container).toBeInTheDocument();
    expect(await findByText('Renovações trabalhistas')).toBeInTheDocument();
  });

  it('Should render correctly for labor modality and substitution type chart', async () => {
    jest
      .spyOn(SummaryChartsApi, 'getChartData')
      .mockImplementation(async () => {
        return substitutionMock(ModalityEnum.LABOR);
      });

    const { container, findByText } = render(
      <Provider store={store}>
        <SummaryChart
          modality={ModalityEnum.LABOR}
          chartType={SummaryChartTypeEnum.SUBSTITUTION}
        />
      </Provider>,
    );
    expect(container).toBeInTheDocument();
    expect(await findByText('Substituições trabalhistas')).toBeInTheDocument();
  });

  it('Should render correctly for labor modality and new issue type chart', async () => {
    jest
      .spyOn(SummaryChartsApi, 'getChartData')
      .mockImplementation(async () => {
        return newIssueMock;
      });

    const { container, findByText } = render(
      <Provider store={store}>
        <SummaryChart
          modality={ModalityEnum.LABOR}
          chartType={SummaryChartTypeEnum.NEW_ISSUE}
        />
      </Provider>,
    );
    expect(container).toBeInTheDocument();
    expect(await findByText('Novas emissões trabalhistas')).toBeInTheDocument();
  });

  it('Should render placeholder for fiscal modality and new issues chart type', async () => {
    const { container, findByText } = render(
      <Provider store={store}>
        <SummaryChart
          modality={ModalityEnum.FISCAL}
          chartType={SummaryChartTypeEnum.NEW_ISSUE}
        />
      </Provider>,
    );
    expect(container).toBeInTheDocument();
    expect(await findByText('Novas emissões fiscais')).toBeInTheDocument();
    expect(
      await findByText('Tipo de oportunidade em construção'),
    ).toBeInTheDocument();
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

  it('Should render correctly for civil modality and substitution type chart', async () => {
    jest
      .spyOn(SummaryChartsApi, 'getChartData')
      .mockImplementation(async () => {
        return substitutionMock(ModalityEnum.CIVIL);
      });

    const { container, findByText } = render(
      <Provider store={store}>
        <SummaryChart
          modality={ModalityEnum.CIVIL}
          chartType={SummaryChartTypeEnum.SUBSTITUTION}
        />
      </Provider>,
    );
    expect(container).toBeInTheDocument();
    expect(await findByText('Substituições cíveis')).toBeInTheDocument();
  });

  it('Should render correctly for civil modality and renewal type chart', async () => {
    jest
      .spyOn(SummaryChartsApi, 'getChartData')
      .mockImplementation(async () => {
        return substitutionMock(ModalityEnum.CIVIL);
      });

    const { container, findByText } = render(
      <Provider store={store}>
        <SummaryChart
          modality={ModalityEnum.CIVIL}
          chartType={SummaryChartTypeEnum.RENEWAL}
        />
      </Provider>,
    );
    expect(container).toBeInTheDocument();
    expect(await findByText('Renovações cíveis')).toBeInTheDocument();
  });

  it('Should render correctly for civil modality and new issue type chart', async () => {
    jest
      .spyOn(SummaryChartsApi, 'getChartData')
      .mockImplementation(async () => {
        return substitutionMock(ModalityEnum.CIVIL);
      });

    const { container, findByText } = render(
      <Provider store={store}>
        <SummaryChart
          modality={ModalityEnum.CIVIL}
          chartType={SummaryChartTypeEnum.NEW_ISSUE}
        />
      </Provider>,
    );
    expect(container).toBeInTheDocument();
    expect(await findByText('Novas emissões cíveis')).toBeInTheDocument();
    expect(
      await findByText('Tipo de oportunidade em construção'),
    ).toBeInTheDocument();
  });
});

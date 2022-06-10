import { store } from '../../../config/store';
import SummaryChartsApi from './SummaryChartsApi';
import { fetchChartData } from './SummaryChartsSlice';
import { SummaryChartDataDTO } from '../../types/dto';
import { ModalityEnum, SummaryChartTypeEnum } from '../../types/model';

describe('SummaryChartsSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetchChartData thunk should call api and set state correctly on success', async () => {
    const mockResponse: SummaryChartDataDTO = {
      series: [
        {
          values: {
            name: 'teste',
            color: '#fff',
            type: 'bar',
            data: [200],
          },
          metadata: {
            useThousandFormatter: false,
            legend: {
              totalizer: 200,
              useThousandFormatter: true,
              useThousandSeparator: false,
            },
            preffix: '',
            suffix: '',
          },
        },
      ],
      categories: [],
      tooltip: { labels: ['teste'] },
    };

    jest
      .spyOn(SummaryChartsApi, 'getChartData')
      .mockImplementation(async () => {
        return mockResponse;
      });

    const result = await store.dispatch(
      fetchChartData({
        modality: ModalityEnum.FISCAL,
        chartType: SummaryChartTypeEnum.RENEWAL,
        federalids: [],
      }),
    );
    expect(SummaryChartsApi.getChartData).toHaveBeenCalledTimes(1);
    expect(result.payload).toStrictEqual(mockResponse);
    const expectedState = store
      .getState()
      .summaryCharts.charts.find(
        c =>
          c.modality === ModalityEnum.FISCAL &&
          c.chartType === SummaryChartTypeEnum.RENEWAL,
      );
    expect(expectedState?.loading).toStrictEqual(false);
    expect(expectedState?.error).toStrictEqual(false);
    expect(expectedState?.data).toStrictEqual(mockResponse);
  });

  it('fetchChartData thunk should call api and set state correctly on success', async () => {
    jest
      .spyOn(SummaryChartsApi, 'getChartData')
      .mockImplementation(async () => {
        return new Promise((resolve, reject) => {
          reject();
        });
      });

    await store.dispatch(
      fetchChartData({
        modality: ModalityEnum.FISCAL,
        chartType: SummaryChartTypeEnum.RENEWAL,
        federalids: [],
      }),
    );
    expect(SummaryChartsApi.getChartData).toHaveBeenCalledTimes(1);
    const expectedState = store
      .getState()
      .summaryCharts.charts.find(
        c =>
          c.modality === ModalityEnum.FISCAL &&
          c.chartType === SummaryChartTypeEnum.RENEWAL,
      );
    expect(expectedState?.loading).toStrictEqual(false);
    expect(expectedState?.error).toStrictEqual(true);
    expect(expectedState?.data).toStrictEqual(null);
  });
});

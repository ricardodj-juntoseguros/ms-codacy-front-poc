import { AxiosHttpClient } from '@infrastructure/http-client';
import { SummaryChartDataDTO } from '../../types/dto';
import { ModalityEnum, SummaryChartTypeEnum } from '../../types/model';
import SummaryChartsApi from './SummaryChartsApi';

describe('SummaryChartsApi', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_FIDELIZE_BFF_URL = 'any_url';
  });

  it('getChartData should call bff service correctly', async () => {
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

    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => mockResponse);

    const result = await SummaryChartsApi.getChartData(
      ModalityEnum.FISCAL,
      SummaryChartTypeEnum.RENEWAL,
      ['11223344556677'],
    );

    expect(mockGet).toHaveBeenCalledWith({
      url: '/v1/charts/fiscal/renewal',
      params: { federalIds: '11223344556677' },
    });

    expect(result).toStrictEqual(mockResponse);
  });
});

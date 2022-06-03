export interface SummaryChartDataDTO {
  series: {
    values: {
      name: string;
      type: string;
      color: string;
      data: number[];
    };
    metadata: {
      useThousandFormatter: boolean;
      preffix: string;
      suffix: string;
      legend: { totalizer: number };
    };
  }[];
  categories: (string[] | string)[];
  tooltip: { labels: string[] };
}

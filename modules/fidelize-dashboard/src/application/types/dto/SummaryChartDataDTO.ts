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
      legend: {
        useThousandFormatter: boolean;
        useThousandSeparator: boolean;
        totalizer: number;
      };
    };
  }[];
  categories: (string[] | string)[];
  tooltip: { labels: string[] };
}

import { ModalityEnum, SummaryChartTypeEnum } from '../application/types/model';

export const CHART_TOOLTIPS = {
  [ModalityEnum.FISCAL]: {
    [SummaryChartTypeEnum.RENEWAL]:
      'As renovações fiscais são aquelas oportunidades que o cliente já optou pelo Seguro Garantia como forma de garantia, porém quando próximas ao vencimento se tornam oportunidades de renovações. Considere como uma oportunidade relevante os seguros com vencimento em até 180 dias antes do término de vigência da apólice.',
    [SummaryChartTypeEnum.SUBSTITUTION]:
      'As substituições fiscais são aquelas oportunidades que o cliente já apresentou uma outra forma de garantia diferente do Seguro, mas pelo fato do processo ainda estar ativo é possível a tentativa da substituição da garantia anterior por uma apólice de Seguro. Quando se tratar de fiança bancária considere a oportunidade relevante, já que o Judiciário aceita bem a substituição desse produto, além do saving que a substituição pode gerar para o seu cliente.  ',
    [SummaryChartTypeEnum.NEW_ISSUE]: null,
  },
  [ModalityEnum.LABOR]: {
    [SummaryChartTypeEnum.RENEWAL]:
      'As renovações trabalhistas são aquelas oportunidades que o cliente já optou pelo Seguro Garantia como forma de garantia, porém quando próximas ao vencimento se tornam oportunidades de renovações.',
    [SummaryChartTypeEnum.SUBSTITUTION]:
      'As substituições trabalhistas são aquelas oportunidades que o cliente já apresentou uma outra forma de garantia diferente do Seguro, mas pelo fato do processo ainda estar ativo é possível a tentativa da substituição da garantia anterior por uma apólice de Seguro.   ',
    [SummaryChartTypeEnum.NEW_ISSUE]:
      'As novas emissões trabalhistas são aquelas oportunidades que o cliente terá que apresentar uma nova garantia, caso evolua com a discussão do processo. De acordo com o momento do processo, indicamos a nossa sensibilidade quanto a iminência de quando o cliente terá que apresentar a nova garantia.',
  },
  [ModalityEnum.CIVIL]: {
    [SummaryChartTypeEnum.RENEWAL]: null,
    [SummaryChartTypeEnum.SUBSTITUTION]:
      'As substituições cíveis são aquelas oportunidades que o cliente já apresentou uma outra forma de garantia diferente do Seguro, mas pelo fato do processo ainda estar ativo é possível a tentativa da substituição da garantia anterior por uma apólice de Seguro. Quando se tratar de fiança bancária considere a oportunidade relevante, já que o Judiciário aceita bem a substituição desse produto, além do saving que a substituição pode gerar para o seu cliente.  ',
    [SummaryChartTypeEnum.NEW_ISSUE]: null,
  },
};

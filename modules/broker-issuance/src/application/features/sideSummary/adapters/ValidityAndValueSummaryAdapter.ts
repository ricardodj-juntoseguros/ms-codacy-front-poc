import { currencyFormatter, thousandSeparator } from '@shared/utils';
import { QuoteResultDTO } from '../../../types/dto';

export const validityAndValueSummaryAdapter = (
  startDateValidity?: string | null,
  endDateValidity?: string | null,
  durationInDays?: number | null,
  securedAmount?: number,
  currentQuote?: QuoteResultDTO | null,
) => {
  const result = [] as { key: string; label: string; value: string }[];

  if (startDateValidity && endDateValidity) {
    result.push({
      key: 'validity',
      label: 'Vigência',
      value: `${startDateValidity} - ${endDateValidity}`,
    });
  }
  if (durationInDays) {
    result.push({
      key: 'duration',
      label: 'Total de dias',
      value: `${durationInDays} dias`,
    });
  }
  if (securedAmount) {
    result.push({
      key: 'securedAmount',
      label: 'Total da cobertura',
      value: currencyFormatter(securedAmount),
    });
  }
  if (currentQuote && currentQuote.totalPrize) {
    const {
      totalPrize,
      proposalFee,
      pricing: {
        commissionFee,
        comissionValue,
        commissionFlexEnabled,
        commissionFlex,
        feeFlexEnabled,
        feeFlex,
      },
    } = currentQuote;
    result.push(
      {
        key: 'prize',
        label: 'Prêmio final',
        value: currencyFormatter(totalPrize),
      },
      {
        key: 'commission',
        label: 'Comissão final',
        value: `${currencyFormatter(comissionValue)} (${thousandSeparator(
          commissionFee,
          '.',
          2,
        )?.replace(',00', '')}%)`,
      },
      {
        key: 'proposalFee',
        label: 'Taxa padrão',
        value: `${thousandSeparator(proposalFee, '.', 2)}%`,
      },
    );
    if (commissionFlexEnabled && commissionFlex) {
      result.push({
        key: 'commissionFlex',
        label: 'Comissão flex',
        value: currencyFormatter(commissionFlex || 0),
      });
    }
    if (feeFlexEnabled && feeFlex) {
      result.push({
        key: 'feeFlex',
        label: 'Taxa flex',
        value: `${thousandSeparator(feeFlex || 0, '.', 2)}%`,
      });
    }
  }

  return result;
};

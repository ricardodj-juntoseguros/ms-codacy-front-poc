import { LinkButton, CurrencyInput, Tag } from 'junto-design-system';
import { useMemo } from 'react';

import { currencyFormatter } from '../../../helpers';

import styles from './RateCalculation.module.scss';

export interface RateCalculationProps {
  maxRate: number;
  finalPrize: number;
  finalCommission: number;
  commissionPercent: number;
  standardRateValue: number;
  handleChangeStandardRate(value: number): void;
  handleDownloadQuote(): void;
  handleEndEditing: () => void;
}

export function RateCalculation({
  maxRate,
  finalPrize,
  finalCommission,
  commissionPercent,
  standardRateValue,
  handleChangeStandardRate,
  handleDownloadQuote,
  handleEndEditing,
}: RateCalculationProps) {
  const formattedFinalPrize = useMemo(() => {
    if (finalPrize) {
      return currencyFormatter(finalPrize);
    }
    return currencyFormatter(0);
  }, [finalPrize]);

  const formattedFinalCommission = useMemo(() => {
    if (finalCommission) {
      return currencyFormatter(finalCommission);
    }
    return currencyFormatter(0);
  }, [finalCommission]);

  function onEndEditing() {
    handleEndEditing();
  }

  return (
    <div className={styles['rate-calculation']} data-testid="rate-calculation">
      <div className={styles['rate-calculation__rate-input-wrapper']}>
        <CurrencyInput
          label="Taxa Padrão"
          placeholder="Taxa Padrão"
          helperMessage={`Taxa máxima ${maxRate}%`}
          maxValue={maxRate}
          minValue={1}
          suffix=" %"
          prefix=""
          allowNegative={false}
          onChange={handleChangeStandardRate}
          value={standardRateValue}
          onBlur={onEndEditing}
        />
      </div>
      <div
        className={styles['rate-calculation__final-values-wrapper']}
        data-testid="rate-calculation-final-values"
      >
        <article>
          <h3>Prêmio final</h3>
          <p>{formattedFinalPrize}</p>
        </article>
        <article>
          <h3>Comissão final</h3>
          <span>
            <p>{formattedFinalCommission}</p>
            <Tag variant="neutral">{commissionPercent}%</Tag>
          </span>
        </article>
      </div>
      <LinkButton
        label="Download da cotação"
        icon="download"
        onClick={handleDownloadQuote}
      />
    </div>
  );
}

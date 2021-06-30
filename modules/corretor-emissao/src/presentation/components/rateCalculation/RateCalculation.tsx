import { LinkButton, NumberInput, Tag } from 'junto-design-system';
import { useMemo } from 'react';

import { currencyFormatter } from '../../../helpers';

import styles from './RateCalculation.module.scss';

export interface RateCalculationProps {
  maxRate: number;
  finalPrize: number;
  finalCommission: number;
  comissionPercent: number;
  standardRateValue: number;
  handleChangeStandardRate(value: number): void;
  handleDownloadQuote(): void;
}

export function RateCalculation({
  maxRate,
  finalPrize,
  finalCommission,
  comissionPercent,
  standardRateValue,
  handleChangeStandardRate,
  handleDownloadQuote,
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

  return (
    <div className={styles['rate-calculation']} data-testid="rate-calculation">
      <div className={styles['rate-calculation__rate-input-wrapper']}>
        {/* <NumberInput
          label="Taxa Padrão"
          helperMessage={`Taxa máxima ${maxRate}%`}
          placeholder=" "
          decimalScale={2}
          maxValue={100}
          minValue={1}
          suffix="%"
          allowNegative={false}
          onChange={value => handleChangeStandardRate(Number(value))}
          value={standardRateValue}
        /> */}
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
            <Tag variant="neutral">{comissionPercent}%</Tag>
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

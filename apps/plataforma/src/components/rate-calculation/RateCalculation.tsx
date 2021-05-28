import { LinkButton, NumberInput, Tag } from '@junto-design-system';

import styles from './RateCalculation.module.scss';

export interface RateCalculationProps {
  maxRate: string;
  finalPrize: string;
  finalCommission: string;
  comissionPercent: string;
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
  return (
    <div className={styles['rate-calculation']} data-testid="rate-calculation">
      <div className={styles['rate-calculation__rate-input-wrapper']}>
        <NumberInput
          label="Taxa Padrão"
          helperMessage={`Taxa máxima ${maxRate}%`}
          placeholder=" "
          decimalScale={2}
          maxValue={100}
          minValue={1}
          suffix="%"
          allowNegative={false}
          onChange={handleChangeStandardRate}
          value={standardRateValue}
        />
      </div>
      <div
        className={styles['rate-calculation__final-values-wrapper']}
        data-testid="rate-calculation-final-values"
      >
        <article>
          <h3>Prêmio final</h3>
          <p>R$ {finalPrize}</p>
        </article>
        <article>
          <h3>Comissão final</h3>
          <span>
            <p>R$ {finalCommission}</p>
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

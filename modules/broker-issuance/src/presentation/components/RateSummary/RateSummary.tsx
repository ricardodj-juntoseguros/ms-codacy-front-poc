import { LinkButton, Tag } from 'junto-design-system';
import { useMemo } from 'react';

import { currencyFormatter } from '../../../helpers';

import styles from './RateSummary.module.scss';

export interface RateSummaryProps {
  finalPrize: number;
  finalCommission: number;
  commissionPercent: number;
  handleDownloadQuote(): void;
}

export function RateSummary({
  finalPrize,
  finalCommission,
  commissionPercent,
  handleDownloadQuote,
}: RateSummaryProps) {
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
    <div>
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

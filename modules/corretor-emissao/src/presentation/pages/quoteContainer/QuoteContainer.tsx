import { SearchContainer } from '../../components/searchContainer';
import { TimeframeAndCoverageContainer } from '../../components/timeframeAndCoverageContainer';
import { RateCalculationContainer } from '../../components/rateCalculationContainer/RateCalculationContainer';

import styles from './QuoteContainer.module.scss';

export function QuoteContainer() {
  return (
    <div className={styles['quote-container__wrapper']}>
      <SearchContainer />
      <TimeframeAndCoverageContainer maxCoverageDays={120} policyholderLimit={50000} />
      <RateCalculationContainer />
    </div>
  );
}

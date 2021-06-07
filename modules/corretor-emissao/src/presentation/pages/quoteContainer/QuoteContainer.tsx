import { SearchContainer } from '../../components/searchContainer';
import { TimeframeAndCoverageContainer } from '../../components/timeframeAndCoverageContainer';

import styles from './QuoteContainer.module.scss';

export function QuoteContainer() {
  return (
    <div className={styles['quote-container__wrapper']}>
      <SearchContainer />
      <TimeframeAndCoverageContainer />
    </div>
  );
}

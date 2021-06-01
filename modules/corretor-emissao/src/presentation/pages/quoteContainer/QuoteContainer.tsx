import { SearchContainer } from '../../components/searchContainer';

import styles from './QuoteContainer.module.scss';

export function QuoteContainer() {
  return (
    <div className={styles['quote-container__wrapper']}>
      <SearchContainer />
    </div>
  );
}

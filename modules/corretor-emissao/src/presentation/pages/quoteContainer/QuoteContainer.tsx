import styles from './QuoteContainer.module.scss';
import { FlowContainer } from '../../components/flowContainer';

export function QuoteContainer() {
  return (
    <div className={styles['quote-container__wrapper']}>
      <FlowContainer />
    </div>
  );
}

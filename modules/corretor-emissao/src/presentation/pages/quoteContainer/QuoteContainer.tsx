import styles from './QuoteContainer.module.scss';
import { FlowContainer } from '../../components/FlowContainer';

export function QuoteContainer() {
  return (
    <div className={styles['quote-container__wrapper']}>
      <FlowContainer />
    </div>
  );
}

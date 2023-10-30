import { FlowProvider } from '@shared/hooks';
import styles from './QuoteContainer.module.scss';

export function QuoteContainer() {
  return (
    <div className={styles['quote-container__wrapper']}>
      <FlowProvider allSteps={[]} initialSteps={[]} showFinishedSteps={false} />
    </div>
  );
}

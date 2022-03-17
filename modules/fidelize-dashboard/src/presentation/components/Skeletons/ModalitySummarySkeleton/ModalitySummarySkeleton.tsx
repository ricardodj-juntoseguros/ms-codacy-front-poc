import { Skeleton } from 'junto-design-system';
import styles from './ModalitySummarySkeleton.module.scss';

const ModalitySummarySkeleton = () => {
  return (
    <div className={styles['modality-summary-skeleton__summary-row']}>
      <div className={styles['modality-summary-skeleton__summary-item']}>
        <Skeleton width={147} height={8} style={{ marginBottom: 12 }} />
        <Skeleton width={112} height={8} />
      </div>
      <div className={styles['modality-summary-skeleton__summary-item']}>
        <Skeleton width={147} height={8} style={{ marginBottom: 12 }} />
        <Skeleton width={112} height={8} />
      </div>
    </div>
  );
};

export default ModalitySummarySkeleton;

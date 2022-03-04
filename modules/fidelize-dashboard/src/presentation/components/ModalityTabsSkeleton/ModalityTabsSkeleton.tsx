import { Divider, Skeleton } from 'junto-design-system';
import styles from './ModalityTabsSkeleton.module.scss';

const ModalityTabsSkeleton = () => {
  return (
    <div>
      <div className={styles['modality-tabs-skeleton__tabs-desktop-row']}>
        <Skeleton width={120} height={8} style={{ marginRight: 48 }} />
        <Skeleton width={120} height={8} style={{ marginRight: 48 }} />
        <Skeleton width={120} height={8} />
      </div>
      <div className={styles['modality-tabs-skeleton__tabs-mobile-row']}>
        <Skeleton width={80} height={8} style={{ marginRight: 24 }} />
        <Skeleton width={80} height={8} style={{ marginRight: 24 }} />
        <Skeleton width={80} height={8} />
      </div>
      <Divider />
      <div className={styles['modality-tabs-skeleton__summary-row']}>
        <div className={styles['modality-tabs-skeleton__summary-item']}>
          <Skeleton width={147} height={8} style={{ marginBottom: 12 }} />
          <Skeleton width={112} height={8} />
        </div>
        <div className={styles['modality-tabs-skeleton__summary-item']}>
          <Skeleton width={147} height={8} style={{ marginBottom: 12 }} />
          <Skeleton width={112} height={8} />
        </div>
      </div>
    </div>
  );
};

export default ModalityTabsSkeleton;

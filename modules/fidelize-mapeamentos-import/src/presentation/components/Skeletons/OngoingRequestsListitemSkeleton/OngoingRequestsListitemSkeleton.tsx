import { Skeleton } from 'junto-design-system';
import styles from './OngoingRequestsListitemSkeleton.module.scss';

export const OngoingRequestsListitemSkeleton: React.FC = () => {
  return (
    <div className={styles['ongoing-request-listitem-skeleton__wrapper']}>
      <div className={styles['ongoing-request-listitem-skeleton__column']}>
        <Skeleton width={64} height={16} />
      </div>
      <div className={styles['ongoing-request-listitem-skeleton__column']}>
        <Skeleton width={154} height={16} />
        <Skeleton width={120} height={16} />
      </div>
      <div className={styles['ongoing-request-listitem-skeleton__column']}>
        <Skeleton width={154} height={16} />
        <Skeleton width={100} height={16} />
      </div>
      <div className={styles['ongoing-request-listitem-skeleton__column']}>
        <div className={styles['ongoing-request-listitem-skeleton__queue']}>
          <span
            className={styles['ongoing-request-listitem-skeleton__queue-badge']}
          />
          <Skeleton width={34} height={16} />
        </div>
      </div>
      <div className={styles['ongoing-request-listitem-skeleton__column']}>
        <div className={styles['ongoing-request-listitem-skeleton__queue']}>
          <span
            className={styles['ongoing-request-listitem-skeleton__queue-badge']}
          />
          <Skeleton width={34} height={16} />
        </div>
      </div>
      <div className={styles['ongoing-request-listitem-skeleton__column']}>
        <div className={styles['ongoing-request-listitem-skeleton__queue']}>
          <span
            className={styles['ongoing-request-listitem-skeleton__queue-badge']}
          />
          <Skeleton width={34} height={16} />
        </div>
      </div>
      <div className={styles['ongoing-request-listitem-skeleton__column']}>
        <div className={styles['ongoing-request-listitem-skeleton__queue']}>
          <span
            className={styles['ongoing-request-listitem-skeleton__queue-badge']}
          />
          <Skeleton width={18} height={16} />
        </div>
      </div>
      <div className={styles['ongoing-request-listitem-skeleton__column']}>
        <div className={styles['ongoing-request-listitem-skeleton__queue']}>
          <span
            className={styles['ongoing-request-listitem-skeleton__queue-badge']}
          />
          <Skeleton width={18} height={16} />
        </div>
      </div>
      <div className={styles['ongoing-request-listitem-skeleton__column']}>
        <Skeleton width={56} height={16} style={{ marginLeft: '8px' }} />
      </div>
    </div>
  );
};

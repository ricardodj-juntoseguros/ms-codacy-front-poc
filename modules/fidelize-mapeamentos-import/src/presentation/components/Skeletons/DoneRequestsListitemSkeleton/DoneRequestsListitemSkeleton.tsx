import { Skeleton } from 'junto-design-system';
import styles from './DoneRequestsListitemSkeleton.module.scss';

export const DoneRequestsListitemSkeleton: React.FC = () => {
  // 65px 170px 210px 180px 170px 120px auto
  return (
    <div className={styles['done-request-listitem-skeleton__wrapper']}>
      <div className={styles['done-request-listitem-skeleton__column']}>
        <Skeleton width={64} height={16} />
      </div>
      <div className={styles['done-request-listitem-skeleton__column']}>
        <Skeleton width={160} height={16} />
        <Skeleton width={140} height={16} />
      </div>
      <div className={styles['done-request-listitem-skeleton__column']}>
        <Skeleton width={200} height={16} />
        <Skeleton width={180} height={16} />
      </div>
      <div className={styles['done-request-listitem-skeleton__column']}>
        <Skeleton width={80} height={16} />
      </div>
      <div className={styles['done-request-listitem-skeleton__column']}>
        <Skeleton width={80} height={16} />
      </div>
      <div className={styles['done-request-listitem-skeleton__column']}>
        <Skeleton width={80} height={16} />
      </div>
    </div>
  );
};

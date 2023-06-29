import { Skeleton } from 'junto-design-system';
import styles from './ProcessListCardSkeleton.module.scss';

const ProcessListCardSkeleton: React.FC = () => {
  return (
    <div className={styles['process-list-card-skeleton__wrapper']}>
      <div>
        <div>
          <div className={styles['process-list-card-skeleton__info']}>
            <Skeleton width={60} />
            <Skeleton width={440} />
          </div>
          <div className={styles['process-list-card-skeleton__info-mobile']}>
            <Skeleton width={60} />
            <Skeleton width={250} />
          </div>
        </div>
        <div>
          <div className={styles['process-list-card-skeleton__info']}>
            <div>
              <Skeleton width={73} height={8} />
            </div>
            <div>
              <Skeleton width={147} />
            </div>
          </div>
          <div className={styles['process-list-card-skeleton__info']}>
            <div>
              <Skeleton width={221} height={8} />
            </div>
            <div>
              <Skeleton width={450} />
            </div>
          </div>
          <div className={styles['process-list-card-skeleton__info-mobile']}>
            <div>
              <Skeleton width={73} height={8} />
            </div>
            <div>
              <Skeleton width={100} />
            </div>
          </div>
          <div className={styles['process-list-card-skeleton__info-mobile']}>
            <div>
              <Skeleton width={180} height={8} />
            </div>
            <div>
              <Skeleton width={200} />
            </div>
          </div>
        </div>
      </div>
      <div>
        <Skeleton width={126} />
      </div>
    </div>
  );
};

export default ProcessListCardSkeleton;

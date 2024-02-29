import { Skeleton } from 'junto-design-system';
import styles from './IncentiveTrailCardSkeleton.module.scss';

const IncentiveTrailCardSkeleton = () => (
  <div className={styles['incentive-trail-card-skeleton__wrapper']}>
    <div>
      <div>
        <Skeleton height={16} width={53} />
      </div>
      <div>
        <Skeleton height={24} width={105} />
      </div>
      <div>
        <Skeleton height={16} width={40} />
      </div>
    </div>
    <div>
      <div>
        <Skeleton height={16} width={70.84} />
      </div>
      <div>
        <Skeleton height={24} width={105} />
      </div>
    </div>
    <div>
      <Skeleton height={20} width={174} />
    </div>
    <div>
      <Skeleton height={32} width={108} />
    </div>
  </div>
);

export default IncentiveTrailCardSkeleton;

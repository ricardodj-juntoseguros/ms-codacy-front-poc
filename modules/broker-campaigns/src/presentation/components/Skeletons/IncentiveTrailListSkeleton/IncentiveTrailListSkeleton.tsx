import styles from './IncentiveTrailListSkeleton.module.scss';
import IncentiveTrailCardSkeleton from '../IncentiveTrailCardSkeleton';

const IncentiveTrailListSkeleton = () => (
  <div
    id="incentiveTrailListSkeleton-wrapper"
    data-testid="incentiveTrailListSkeleton-wrapper"
    className={styles['incentive-trail-list-skeleton__wrapper']}
  >
    <IncentiveTrailCardSkeleton />
    <IncentiveTrailCardSkeleton />
    <IncentiveTrailCardSkeleton />
    <IncentiveTrailCardSkeleton />
    <IncentiveTrailCardSkeleton />
  </div>
);

export default IncentiveTrailListSkeleton;

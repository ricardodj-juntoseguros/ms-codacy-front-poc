import { Skeleton } from 'junto-design-system';
import styles from './SummaryChartSkeleton.module.scss';

const SummaryChartSkeleton = () => {
  return (
    <div className={styles['summary-chart-skeleton__wrapper']}>
      <Skeleton width={200} height={16} />
      <div className={styles['summary-chart-skeleton__legend']}>
        <div>
          <div>
            <Skeleton width={8} height={8} style={{ marginRight: 16 }} circle />
          </div>
          <div>
            <Skeleton width={64} height={8} />
            <Skeleton width={76} height={8} />
          </div>
        </div>
        <div>
          <div>
            <Skeleton width={8} height={8} style={{ marginRight: 16 }} circle />
          </div>
          <div>
            <Skeleton width={64} height={8} />
            <Skeleton width={76} height={8} />
          </div>
        </div>
      </div>
      <div className={styles['summary-chart-skeleton__bars']}>
        <div>
          <Skeleton width={32} height={116} />
        </div>
        <div>
          <Skeleton width={32} height={96} />
        </div>
        <div>
          <Skeleton width={32} height={128} />
        </div>
        <div>
          <Skeleton width={32} height={142} />
        </div>
      </div>
    </div>
  );
};

export default SummaryChartSkeleton;

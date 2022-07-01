import { Skeleton } from 'junto-design-system';
import styles from './OpportunityDetailsListItemSkeleton.module.scss';

const OpportunityDetailsListItemSkeleton: React.FC = () => {
  return (
    <div className={styles['opportunity-details-listitem__wrapper']}>
      <div className={styles['opportunity-details-listitem__column']} />
      <div className={styles['opportunity-details-listitem__column']}>
        <Skeleton width={46} height={8} />
      </div>
      <div className={styles['opportunity-details-listitem__column']}>
        <Skeleton width={95} height={8} />
        <Skeleton width={144} height={8} />
      </div>
      <div className={styles['opportunity-details-listitem__column']}>
        <p className={styles['opportunity-details-listitem__label']}>
          <Skeleton width={73} height={8} />
        </p>
      </div>
      <div className={styles['opportunity-details-listitem__column']}>
        <Skeleton width={200} height={8} />
      </div>
      <div className={styles['opportunity-details-listitem__column']}>
        <Skeleton width={73} height={8} />
      </div>
    </div>
  );
};

export default OpportunityDetailsListItemSkeleton;

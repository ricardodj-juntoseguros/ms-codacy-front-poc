import { Skeleton } from 'junto-design-system';
import styles from './PolicyholderContactSkeleton.module.scss';

const PolicyholderContactSkeleton = () => {
  return (
    <div
      data-testid="PolicyholderContactSkeleton-div-skeleton"
      className={styles['policyholder-contact-skeleton__wrapper']}
    >
      <div>
        <Skeleton height={12} width={56} />
        <Skeleton height={16} width={504} />
      </div>
      <div>
        <Skeleton height={12} width={56} />
        <Skeleton height={16} width={504} />
      </div>
    </div>
  );
};

export default PolicyholderContactSkeleton;

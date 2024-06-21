import { Skeleton } from 'junto-design-system';
import styles from './InsuredAndPolicyholderSelectionSkeleton.module.scss';

const InsuredAndPolicyholderSelectionSkeleton = () => {
  return (
    <div
      data-testid="insuredAndPolicyholderSelectionSkeleton-div-skeleton"
      className={styles['insured-policyholder-selection-skeleton__wrapper']}
    >
      <div>
        <Skeleton height={16} width={200} />
      </div>
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

export default InsuredAndPolicyholderSelectionSkeleton;

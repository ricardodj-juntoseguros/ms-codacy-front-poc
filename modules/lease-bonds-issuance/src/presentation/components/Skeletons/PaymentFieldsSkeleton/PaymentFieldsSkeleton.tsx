import { Skeleton } from 'junto-design-system';

import { FunctionComponent } from 'react';
import styles from './PaymentFieldsSkeleton.module.scss';

interface PaymentFieldsSkeletonSkeletonProps {
  showPaymentType?: boolean;
}

const PaymentFieldsSkeleton: FunctionComponent<PaymentFieldsSkeletonSkeletonProps> =
  ({ showPaymentType }) => {
    return (
      <div className={styles['payment-fields-skeleton__wrapper']}>
        <div>
          <Skeleton height={22} width="100%" />
        </div>
        {showPaymentType && (
          <div>
            <Skeleton height={65} width="100%" />
          </div>
        )}
        <div>
          <div>
            <Skeleton height={65} width="100%" />
          </div>
          <div>
            <Skeleton height={65} width="100%" />
          </div>
        </div>
      </div>
    );
  };

export default PaymentFieldsSkeleton;

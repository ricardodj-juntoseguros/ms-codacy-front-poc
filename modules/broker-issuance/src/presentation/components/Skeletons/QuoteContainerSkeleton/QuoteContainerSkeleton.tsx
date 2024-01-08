import { Skeleton } from 'junto-design-system';
import styles from './QuoteContainerSkeleton.module.scss';

const QuoteContainerSkeleton = () => {
  return (
    <div className={styles['quote-container-skeleton__wrapper']}>
      <div className={styles['quote-container-skeleton__step-wrapper']}>
        <div>
          <div>
            <div>
              <Skeleton height={40} width={40} circle />
            </div>
            <div>
              <Skeleton height={48} width={650} />
            </div>
          </div>
          <div>
            <Skeleton height={40} width="100%" />
          </div>
          <div>
            <Skeleton height={40} width="100%" />
          </div>
          <div>
            <Skeleton height={64} width={312} />
          </div>
        </div>
        <div>
          <div>
            <Skeleton height={40} width={40} circle />
          </div>
          <div>
            <Skeleton height={80} width="100%" />
          </div>
          <div>
            <Skeleton height={40} width="100%" />
          </div>
          <div>
            <Skeleton height={40} width="100%" />
          </div>
          <div>
            <Skeleton height={64} width="100%" />
          </div>
        </div>
      </div>
      <div className={styles['quote-container-skeleton__summary-wrapper']}>
        <h2>Resumo</h2>
        <div>
          <Skeleton height={32} width={32} circle />
          <Skeleton height={32} width="100%" />
        </div>
        <Skeleton height={32} width={80} />
      </div>
    </div>
  );
};

export default QuoteContainerSkeleton;

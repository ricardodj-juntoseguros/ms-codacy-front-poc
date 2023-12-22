import { Skeleton } from 'junto-design-system';
import styles from './QuoteContainerSkeleton.module.scss';

const QuoteContainerSkeleton = () => {
  return (
    <div className={styles['quote-container-skeleton__wrapper']}>
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
          <Skeleton height={40} width={552} />
        </div>
        <div>
          <Skeleton height={40} width={552} />
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
  );
};

export default QuoteContainerSkeleton;

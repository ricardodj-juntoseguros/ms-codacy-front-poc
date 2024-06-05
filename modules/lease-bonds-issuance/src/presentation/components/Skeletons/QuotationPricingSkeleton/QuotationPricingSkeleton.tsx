import { Skeleton } from 'junto-design-system';
import styles from './QuotationPricingSkeleton.module.scss';

const QuotationPricingSkeleton = () => {
  return (
    <div className={styles['quotation-pricing-skeleton__wrapper']}>
      <div>
        <div>
          <Skeleton height={22} width="100%" />
        </div>
        <div>
          <div>
            <Skeleton height={64} width="100%" />
            <Skeleton height={22} width="100%" style={{ maxWidth: '222px' }} />
          </div>
          <div>
            <Skeleton height={64} width={127} />
          </div>
        </div>
        <div>
          <div>
            <Skeleton height={22} width="100%" style={{ maxWidth: '230px' }} />
            <Skeleton height={22} width="100%" style={{ maxWidth: '230px' }} />
          </div>
          <div>
            <Skeleton
              height={22}
              style={{ width: '100%', maxWidth: '187px' }}
            />
            <Skeleton
              height={22}
              style={{ width: '100%', maxWidth: '187px' }}
            />
          </div>
        </div>
      </div>
      <div>
        <div>
          <Skeleton height={22} width="100%" style={{ minWidth: '264px' }} />
        </div>
        <div>
          <div>
            <Skeleton height={64} width="100%" style={{ minWidth: '264px' }} />
            <Skeleton height={22} width="100%" style={{ minWidth: '264px' }} />
          </div>
          <div>
            <Skeleton height={64} width="100%" style={{ minWidth: '264px' }} />
          </div>
        </div>
        <div>
          <Skeleton height={22} width="100%" style={{ minWidth: '264px' }} />
          <Skeleton height={22} width="100%" style={{ minWidth: '264px' }} />
        </div>
      </div>
    </div>
  );
};

export default QuotationPricingSkeleton;

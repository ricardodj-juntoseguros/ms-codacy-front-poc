import { Skeleton } from 'junto-design-system';
import styles from './QuotationPricingSkeleton.module.scss';

const QuotationPricingSkeleton = () => {
  return (
    <div className={styles['quotation-pricing-skeleton__wrapper']}>
      <div>
        <div>
          <Skeleton height={22} width={637} />
        </div>
        <div>
          <div>
            <Skeleton height={64} width={494} />
            <Skeleton height={22} width={222} />
          </div>
          <div>
            <Skeleton height={64} width={127} />
          </div>
        </div>
        <div>
          <div>
            <Skeleton height={22} width={230} />
            <Skeleton height={22} width={230} />
          </div>
          <div>
            <Skeleton height={22} width={187} />
            <Skeleton height={22} width={187} />
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

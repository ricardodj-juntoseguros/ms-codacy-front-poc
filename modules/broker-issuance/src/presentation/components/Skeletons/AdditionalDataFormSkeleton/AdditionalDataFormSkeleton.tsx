import { Skeleton } from 'junto-design-system';

import styles from './AdditionalDataFormSkeleton.module.scss';

const AdditionalDataFormSkeleton = () => {
  return (
    <div className={styles['additional-data-form-skeleton__wrapper']}>
      <div>
        <div>
          <Skeleton height={22} width="100%" />
        </div>
        <div>
          <Skeleton height={109} width="100%" />
        </div>
      </div>
      <div>
        <Skeleton height={128} width="100%" />
      </div>
      <div>
        <div>
          <Skeleton height={20} width={216} />
          <Skeleton height={20} width={166} />
        </div>
        <div>
          <Skeleton height={64} width="100%" />
        </div>
      </div>
    </div>
  );
};

export default AdditionalDataFormSkeleton;

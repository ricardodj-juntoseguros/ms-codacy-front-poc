import { Skeleton } from 'junto-design-system';
import styles from './InternalizeDocumentsSkeleton.module.scss';

const InternalizeDocumentsSkeleton = () => {
  return (
    <li className={styles['internalize-documents-skeleton__wrapper']}>
      <div>
        <Skeleton height={18} width="100%" />
      </div>
      <div>
        <Skeleton height={18} width="100%" />
      </div>
      <div>
        <Skeleton height={18} width="100%" />
      </div>
      <div>
        <Skeleton height={18} width="100%" />
      </div>
    </li>
  );
};

export default InternalizeDocumentsSkeleton;

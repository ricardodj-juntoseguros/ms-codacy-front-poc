import { Skeleton } from 'junto-design-system';

import styles from './UploaDocumentsSkeleton.module.scss';

const UploadDocumentsSkeleton = () => {
  return (
    <div className={styles['upload-documents-skeleton__wrapper']}>
      <div>
        <Skeleton height={22} width="100%" />
      </div>
      <div>
        <Skeleton height={22} width="100%" />
        <Skeleton height={22} width="100%" />
        <Skeleton height={22} width="100%" />
      </div>
      <div>
        <Skeleton height={80} width="100%" />
      </div>
    </div>
  );
};

export default UploadDocumentsSkeleton;

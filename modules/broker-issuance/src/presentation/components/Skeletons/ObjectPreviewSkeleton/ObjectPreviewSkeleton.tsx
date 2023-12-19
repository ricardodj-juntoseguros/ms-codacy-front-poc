import { Skeleton } from 'junto-design-system';

import styles from './ObjectPreviewSkeleton.module.scss';

const ObjectPreviewSkeleton = () => {
  return (
    <div className={styles['object-preview-skeleton__wrapper']}>
      <div>
        <Skeleton height={22} width="100%" />
        <Skeleton height={110} width="100%" />
        <Skeleton height={132} width="100%" />
        <Skeleton height={44} width="100%" />
      </div>
      <div>
        <Skeleton height={102} width="100%" />
      </div>
    </div>
  );
};

export default ObjectPreviewSkeleton;

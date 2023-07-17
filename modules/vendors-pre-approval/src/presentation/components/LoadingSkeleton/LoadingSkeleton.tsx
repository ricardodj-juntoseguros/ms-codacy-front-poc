import { SkeletonThemeProvider, Skeleton } from 'junto-design-system';
import className from 'classnames';

import styles from './styles.module.scss';

export function LoadingSkeleton() {
  return (
    <SkeletonThemeProvider>
      <div className={className(styles['loading-skeleton-wrapper'])}>
        <div className={className(styles['loading-skeleton__section'])}>
          <div className={className(styles['loading-skeleton-item'])}>
            <Skeleton height={10} width={200} />
            <Skeleton height={25} width={450} />
          </div>
          <div className={className(styles['loading-skeleton-item'])}>
            <Skeleton height={10} width={200} />
            <Skeleton height={25} width={450} />
          </div>
          <div className={className(styles['loading-skeleton__grid'])}>
            <div className={className(styles['loading-skeleton-item'])}>
              <Skeleton height={10} width={80} />
              <Skeleton height={25} width={150} />
            </div>
            <div className={className(styles['loading-skeleton-item'])}>
              <Skeleton height={10} width={80} />
              <Skeleton height={25} width={150} />
            </div>
            <div className={className(styles['loading-skeleton-item'])}>
              <Skeleton height={10} width={80} />
              <Skeleton height={25} width={150} />
            </div>
            <div className={className(styles['loading-skeleton-item'])}>
              <Skeleton height={10} width={80} />
              <Skeleton height={25} width={150} />
            </div>
          </div>
          <div className={className(styles['loading-skeleton__grid'])}>
            <div className={className(styles['loading-skeleton-item'])}>
              <Skeleton height={10} width={80} />
              <Skeleton height={25} width={150} />
            </div>
            <div className={className(styles['loading-skeleton-item'])}>
              <Skeleton height={10} width={80} />
              <Skeleton height={25} width={150} />
            </div>
          </div>
        </div>
      </div>
    </SkeletonThemeProvider>
  );
}

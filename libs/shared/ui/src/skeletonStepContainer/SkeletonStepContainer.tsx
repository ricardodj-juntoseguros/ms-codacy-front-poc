import { SkeletonThemeProvider, Skeleton } from 'junto-design-system';
import className from 'classnames';

import styles from './styles.module.scss';

export function SkeletonStepContainer() {
  return (
    <SkeletonThemeProvider>
      <div className={className(styles['skeleton-step-container'])}>
        <div className={className(styles['skeleton-step-container__internal'])}>
          <div className={className(styles['skeleton-step-container__number'])}>
            <Skeleton height={16} width={16} />
          </div>
          <div className={className(styles['skeleton-step-container__box'])}>
            <div>
              <Skeleton />
            </div>
            <div
              className={className(styles['skeleton-step-container__box-info'])}
            >
              <div
                className={className(styles['skeleton-step-container__info'])}
              >
                <Skeleton height={8} width={56} />
                <Skeleton height={16} width={136} />
              </div>
              <div
                className={className(styles['skeleton-step-container__info'])}
              >
                <Skeleton height={8} width={56} />
                <Skeleton height={16} width={136} />
              </div>
              <div
                className={className(styles['skeleton-step-container__info'])}
              >
                <Skeleton height={8} width={56} />
                <Skeleton height={16} width={136} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SkeletonThemeProvider>
  );
}

import { ReactNode } from 'react';
import className from 'classnames';
import { SkeletonStepContainer } from '@shared/ui';

import styles from './StepContainer.module.scss';

export interface StepContainerProps {
  stepNumber?: number;
  isVisible?: boolean;
  isEnabled?: boolean;
  isLoading?: boolean;
  title: ReactNode;
  children: ReactNode;
}

export function StepContainer({
  stepNumber = 1,
  isVisible = true,
  isEnabled = true,
  isLoading = false,
  title,
  children,
}: StepContainerProps) {
  if (isLoading) {
    return <SkeletonStepContainer />;
  }

  if (isVisible) {
    return (
      <div
        className={className(styles['step-container'], {
          [styles['step-container--active']]: isEnabled,
        })}
        data-testid="step-container"
      >
        <span className={styles['step-container__step-number']}>
          {stepNumber}
        </span>
        <div className={className(styles['step-container__step-content'])}>
          <div
            className={className(
              styles['step-container__step-content__header'],
            )}
          >
            {title}
          </div>
          {children}
        </div>
      </div>
    );
  }

  return null;
}

import { ReactNode } from 'react';
import className from 'classnames';

import styles from './StepContainer.module.scss';

export interface StepContainerProps {
  stepNumber?: number;
  active?: boolean;
  title: ReactNode;
  children: ReactNode;
}

export function StepContainer({
  stepNumber = 1,
  active,
  title,
  children,
}: StepContainerProps) {
  return (
    <div
      className={className(styles['step-container'], {
        [styles['step-container--active']]: active,
      })}
      data-testid="step-container"
    >
      <span className={styles['step-container__step-number']}>
        {stepNumber}
      </span>
      <div className={className(styles['step-container__step-content'])}>
        <div
          className={className(styles['step-container__step-content__header'])}
        >
          {title}
        </div>
        {children}
      </div>
    </div>
  );
}

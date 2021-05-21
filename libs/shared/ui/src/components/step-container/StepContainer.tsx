import { ReactNode } from 'react';
import className from 'classnames';

import styles from './StepContainer.module.scss';

export interface StepContainerProps {
  stepNumber: number;
  active?: boolean;
  title: ReactNode;
  children: ReactNode;
}

export function StepContainer({
  stepNumber,
  active,
  title,
  children,
}: StepContainerProps) {
  return (
    <div className={styles['step-container']} data-testid="step-container">
      <span
        className={className(styles['step-container__step-number'], {
          [styles['step-container__step-number--active']]: active,
        })}
      >
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

import React, { ReactNode } from 'react';
import className from 'classnames';

import styles from './StepContainer.module.scss';

export interface StepContainerProps {
  stepNumber: number;
  active?: boolean;
  children: ReactNode | HTMLElement;
}

export function StepContainer(props: StepContainerProps) {
  return (
    <div className={styles['step-container']} data-testid="step-container">
      <span className={className(
        styles['step-container__step-number'],
        { [styles['step-container__step-number--active']]: props.active }
      )
      }>
        {props.stepNumber}
      </span>
        {props.children}
    </div>
  );
}

import React from 'react';
import styles from './Spinner.module.scss';

export interface SpinnerProps {
  width: number;
  height: number;
}

export const Spinner: React.FC<SpinnerProps> = ({ width, height }) => {
  return (
    <div className={styles.spinner__wrapper}>
      <svg style={{ width, height }} className="circular" viewBox="25 25 50 50">
        <circle
          className="path"
          cx="50"
          cy="50"
          r="20"
          fill="none"
          strokeWidth="5"
        />
      </svg>
    </div>
  );
};

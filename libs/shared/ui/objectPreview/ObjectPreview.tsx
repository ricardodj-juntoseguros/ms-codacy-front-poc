import className from 'classnames';
import { ReactNode } from 'react';
import styles from './ObjectPreview.module.scss';

export interface ObjectPreviewProps {
  title: ReactNode;
  description: ReactNode;
}

export function ObjectPreview({ title, description }: ObjectPreviewProps) {
  return (
    <div className={className(styles['object-preview'])}>
      <title className={className(styles['object-preview__title'])}>
        {title}
      </title>
      {description}
    </div>
  );
}

import className from 'classnames';
import { useContext } from 'react';
import { ThemeContext } from 'junto-design-system';
import { nanoid } from '@reduxjs/toolkit';
import styles from './SummaryField.module.scss';

export interface SummaryFieldProps {
  title: string;
  values: Array<string | number>;
  helpText?: string | number;
}

const SummaryField: React.FunctionComponent<SummaryFieldProps> = ({
  title,
  values,
  helpText,
  children,
}) => {
  const theme = useContext(ThemeContext);

  const renderValues = () => {
    return values.map(value => (
      <p
        className={className(styles['summary-field__value'], styles[theme])}
        key={nanoid(5)}
      >
        {value}
      </p>
    ));
  };

  const renderHelpText = () => {
    if (!helpText) return null;

    return (
      <span
        className={className(styles['summary-field__help-text'], styles[theme])}
      >
        {helpText}
      </span>
    );
  };

  return (
    <article className={styles['summary-field__wrapper']}>
      <h3 className={className(styles['summary-field__title'], styles[theme])}>
        {title}
      </h3>

      {children}

      {renderValues()}

      {renderHelpText()}
    </article>
  );
};

export default SummaryField;

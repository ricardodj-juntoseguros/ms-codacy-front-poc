import { InputHTMLAttributes } from 'react';
import className from 'classnames';

import styles from './RadioButton.module.scss';

interface CustomRadioButtonProps {
  id: string;
  name: string;
  onChange: (value: any) => void;
  value: string | number;
  label: string;
  selectedValue: any;
}

type CustomInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'id' | 'name' | 'onChange' | 'value'
>;

export type RadioButtonProps = CustomRadioButtonProps & CustomInputProps;

export const RadioButton = ({
  id,
  name,
  onChange,
  value,
  label,
  selectedValue,
  ...rest
}: RadioButtonProps) => {
  const isChecked = selectedValue
    ? selectedValue.toString() === value.toString()
    : false;
  return (
    <div className={styles['j-radio-button']}>
      <label htmlFor={id} className={styles['j-radio-button__label']}>
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          onChange={e => onChange(e.target.value)}
          checked={isChecked}
          className={styles['j-radio-button__input']}
          {...rest}
        />
        <span className={styles['j-radio-button__radio']}>
          {isChecked && <i className={className('icon', 'icon-check')} />}
        </span>
      </label>
      <label htmlFor={id} className={styles['j-radio-button__text']}>
        {label}
      </label>
    </div>
  );
};

export default RadioButton;

import { InputBase } from 'junto-design-system';
import { useState, useEffect, useRef } from 'react';
import styles from './ValidationEmailCode.module.scss';
import RegisterBrokerApi from '../../../application/features/RegisterBroker/RegisterBrokerApi';
import { inputNoAcceptLetters } from '../../../helpers';

export interface ValidationEmailCodeProps {
  codeIsValid: boolean;
  onSetCodeIsValid: (value: boolean) => void;
  codeIsComplet: boolean;
  onSetCodeIsComplet: (value: boolean) => void;
  userPath: string;
}

export function ValidationEmailCode({
  codeIsValid,
  onSetCodeIsValid,
  codeIsComplet,
  onSetCodeIsComplet,
  userPath,
}: ValidationEmailCodeProps) {
  const [codeValidationFirstNumber, setCodeValidationFirstNumber] =
    useState<string>('');
  const [codeValidationSecondNumber, setCodeValidationSecondNumber] =
    useState<string>('');
  const [codeValidationThirdNumber, setCodeValidationThirdNumber] =
    useState<string>('');
  const [codeValidationFourthNumber, setCodeValidationFourthNumber] =
    useState<string>('');
  const FirstNumberRef = useRef<HTMLInputElement>(null);
  const SecondNumberRef = useRef<HTMLInputElement>(null);
  const ThirdNumberRef = useRef<HTMLInputElement>(null);
  const FourthNumberRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (
      codeValidationFirstNumber !== '' &&
      codeValidationSecondNumber !== '' &&
      codeValidationThirdNumber !== '' &&
      codeValidationFourthNumber !== ''
    ) {
      const code =
        codeValidationFirstNumber +
        codeValidationSecondNumber +
        codeValidationThirdNumber +
        codeValidationFourthNumber;
      RegisterBrokerApi.GetValidationCodeEmail(code, userPath)
        .then(response => {
          onSetCodeIsComplet(true);
          onSetCodeIsValid(response);
        })
        .catch(() => {
          onSetCodeIsComplet(true);
          onSetCodeIsValid(false);
        });
    }
  }, [
    codeValidationFirstNumber,
    codeValidationSecondNumber,
    codeValidationThirdNumber,
    codeValidationFourthNumber,
  ]);

  const handleCodeFirstNumber = (value: string) => {
    setCodeValidationFirstNumber(value);
    if (value !== '') {
      SecondNumberRef.current?.focus();
    }
  };
  const handleCodeSecondNumber = (value: string) => {
    setCodeValidationSecondNumber(value);
    if (value !== '') {
      ThirdNumberRef.current?.focus();
    }
  };

  const handleCodeThirdNumber = (value: string) => {
    setCodeValidationThirdNumber(value);
    if (value !== '') {
      FourthNumberRef.current?.focus();
    }
  };

  const handleCodeFourthNumber = (value: string) => {
    setCodeValidationFourthNumber(value);
  };

  return (
    <div className={styles['validation_email_code_wrapper']}>
      <div className={styles['validation_email_code_grid_inputs']}>
        <div
          id="validationBrokerEmail-firstNumberCode-input"
          className={styles['validation_email_code__form-field']}
        >
          <InputBase
            ref={FirstNumberRef}
            data-testid="broker-FirstNumber"
            onChange={e => {
              handleCodeFirstNumber(inputNoAcceptLetters(e.target.value));
            }}
            maxLength={1}
            value={codeValidationFirstNumber}
            errorMessage={!codeIsValid && codeIsComplet ? ' ' : ''}
          />
        </div>
        <div
          id="validationBrokerEmail-secondNumberCode-input"
          className={styles['validation_email_code__form-field']}
        >
          <InputBase
            ref={SecondNumberRef}
            data-testid="broker-SecondNumber"
            onChange={e =>
              handleCodeSecondNumber(inputNoAcceptLetters(e.target.value))
            }
            maxLength={1}
            value={codeValidationSecondNumber}
            errorMessage={!codeIsValid && codeIsComplet ? ' ' : ''}
          />
        </div>
        <div
          id="validationBrokerEmail-thirdNumberCode-input"
          className={styles['validation_email_code__form-field']}
        >
          <InputBase
            ref={ThirdNumberRef}
            data-testid="broker-ThirdNumber"
            onChange={e =>
              handleCodeThirdNumber(inputNoAcceptLetters(e.target.value))
            }
            maxLength={1}
            value={codeValidationThirdNumber}
            errorMessage={!codeIsValid && codeIsComplet ? ' ' : ''}
          />
        </div>
        <div
          id="validationBrokerEmail-fourthNumberCode-input"
          className={styles['validation_email_code__form-field']}
        >
          <InputBase
            ref={FourthNumberRef}
            data-testid="broker-FourthNumber"
            onChange={e =>
              handleCodeFourthNumber(inputNoAcceptLetters(e.target.value))
            }
            maxLength={1}
            value={codeValidationFourthNumber}
            errorMessage={!codeIsValid && codeIsComplet ? ' ' : ''}
          />
        </div>
        <div className={styles['validation_email_code__form-field']}>
          {codeIsValid && codeIsComplet && (
            <i data-icon="check" className="icon icon-check" />
          )}
          {!codeIsValid && codeIsComplet && (
            <i data-icon="x" className="icon icon-x" />
          )}
        </div>
      </div>
      {!codeIsValid && codeIsComplet && (
        <span className={styles['validation_email_code_error_message']}>
          O código está incorreto ou expirado. Revise e se necessário envie um
          novo código.{' '}
        </span>
      )}
    </div>
  );
}

export default ValidationEmailCode;

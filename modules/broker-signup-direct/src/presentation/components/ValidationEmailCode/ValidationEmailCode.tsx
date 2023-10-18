

import { NumberInput } from 'junto-design-system';
import { useState, useEffect } from 'react';
import styles from './ValidationEmailCode.module.scss';
import  RegisterBrokerApi from '../../../application/features/RegisterBroker/RegisterBrokerApi'

export interface ValidationEmailCodeProps {
  codeIsValid: boolean;
  onSetCodeIsValid: (value: boolean) => void;
  codeIsComplet: boolean;
  onSetCodeIsComplet: (value: boolean) => void;
  userPath: string
}

export function ValidationEmailCode({
  codeIsValid,
  onSetCodeIsValid,
  codeIsComplet,
  onSetCodeIsComplet,
  userPath
}: ValidationEmailCodeProps) {
  const [codeValidationFirstNumber, setCodeValidationFirstNumber] =useState<number>(null as any);
  const [codeValidationSecondNumber, setCodeValidationSecondNumber] =useState<number>(null as any);
  const [codeValidationThirdNumber, setCodeValidationThirdNumber] =useState<number>(null as any);
  const [codeValidationFourthNumber, setCodeValidationFourthNumber] =useState<number>(null as any);


  useEffect(() => {
    if(codeValidationFirstNumber !==null && codeValidationSecondNumber !==null &&  codeValidationThirdNumber !==null && codeValidationFourthNumber !==null){
      const code = codeValidationFirstNumber.toString() + codeValidationSecondNumber.toString() + codeValidationThirdNumber.toString() + codeValidationFourthNumber.toString()
      RegisterBrokerApi.GetValidationCodeEmail(code,userPath)
      .then(response => {
          onSetCodeIsComplet(true)
          onSetCodeIsValid(response)
      })
      .catch(() => {
        onSetCodeIsComplet(true)
        onSetCodeIsValid(false)
      })
    }
  },[codeValidationFirstNumber, codeValidationFourthNumber, codeValidationSecondNumber, codeValidationThirdNumber]);

  return (
    <div className={styles['validation_email_code_wrapper']}>
      <div className={styles['validation_email_code_grid_inputs']}>
        <div className={styles['validation_email_code__form-field']}>
          <NumberInput
                    data-testid="broker-cep"
                    onChange={e => setCodeValidationFirstNumber(e)}
                    minValue={0}
                    maxLength={1}
                    value={codeValidationFirstNumber}
                    errorMessage={(!codeIsValid && codeIsComplet) ? ' ' : ''}                    />
        </div>
        <div className={styles['validation_email_code__form-field']}>
        <NumberInput
                    data-testid="broker-cep"
                    onChange={e => setCodeValidationSecondNumber(e)}
                    maxLength={1}
                    value={codeValidationSecondNumber}
                    errorMessage={!codeIsValid && codeIsComplet ? ' ' : ''}/>

        </div>
        <div className={styles['validation_email_code__form-field']}>
        <NumberInput
                    data-testid="broker-cep"
                    onChange={e => setCodeValidationThirdNumber(e)}
                    maxLength={1}
                    value={codeValidationThirdNumber}
                    errorMessage={!codeIsValid && codeIsComplet ? ' ' : ''}/>

       </div>
       <div className={styles['validation_email_code__form-field']}>
       <NumberInput
                    data-testid="broker-cep"
                    onChange={e => setCodeValidationFourthNumber(e)}
                    maxLength={1}
                    value={codeValidationFourthNumber}
                    errorMessage={!codeIsValid && codeIsComplet ? ' ' : ''}/>
      </div>
      <div className={styles['validation_email_code__form-field']}>
        {codeIsValid && codeIsComplet &&  <i data-icon="check" className="icon icon-check" /> }
        {!codeIsValid && codeIsComplet &&  <i data-icon="x" className="icon icon-x" /> }
      </div>
      </div>
      { !codeIsValid && codeIsComplet &&
      <span className={styles['validation_email_code_error_message']}>O código está incorreto ou expirado. Revise e se necessário envie um novo código. </span>
      }
      </div>
  );
};

export default ValidationEmailCode;

/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { InputBase, Button } from 'junto-design-system';
import { cpfFormatter, phoneFormatter } from '@shared/utils';
import { ValidationModel } from 'modules/broker-signup/src/application/types/model';
import styles from './ResponsibleInformation.module.scss';
import { responsibleFormatterName } from '../../../helpers';
import { useAppDispatch } from '../../../config/store';
import { responsibleInformationSliceActions, selectResponsibleInformation } from '../../../application/features/responsibleInformation/ResponsibleInformationSlice';
import { validationActions, selectValidation,validateForm } from '../../../application/features/validation/ValidationSlice';
import {  ResponsibleInformationDataSchema } from '../../../application/features/validations/schemas/componentSchemas';

export const ResponsibleInformation: React.FC = () => {
  const [isDisableGoNextStep, setIsDisableGoNextStep] = useState(true);
  const dispatch = useAppDispatch();
  const responsabileInformation = useSelector(selectResponsibleInformation);
  const { errors } = useSelector(selectValidation);

  useEffect(() => {
    const hasNotInputEmpty = responsabileInformation.name !== '' && responsabileInformation.email !== ''
    && responsabileInformation.cpf !== '' && responsabileInformation.phone !== ''
    const hasInputError = Object.values(errors).length
    if(hasNotInputEmpty && hasInputError === 0){
     setIsDisableGoNextStep(false);
    }
  }, [responsabileInformation.name,
      responsabileInformation.email,
      responsabileInformation.cpf,
      responsabileInformation.phone,
      errors]);

  const handleNameChange = (value: string) => {
    dispatch(responsibleInformationSliceActions.setName(value));
    dispatch(validationActions.removeErrorMessage('name'));
  };
  const handleCpfChange = (value: string) => {
    dispatch(responsibleInformationSliceActions.setCpf(value));
    dispatch(validationActions.removeErrorMessage('cpf'));
  };
  const handlePhoneNumberChange = (value: string) => {
    dispatch(responsibleInformationSliceActions.setPhone(value));
    dispatch(validationActions.removeErrorMessage('phone'));
  };
  const handleEmailChange = (value: string) => {
    dispatch(responsibleInformationSliceActions.setEmail(value));
    dispatch(validationActions.removeErrorMessage('email'));
  };


  const onSubmit = () => {
    return '';
  };

  const showFormError = (input: string, error: string) => {
      dispatch(
        validationActions.setErrorMessages({
          [input]: [error],
        }),
      );
      setIsDisableGoNextStep(true);
  };

  const validate = async (input: string,error: string) => {
    const validateResult = await dispatch(
      validateForm({
        schema: ResponsibleInformationDataSchema,
        data:
        {
          nameResponsible: responsabileInformation.name,
          documentNumber: responsabileInformation.cpf,
          phone: responsabileInformation.phone,
          email: responsabileInformation.email
        },
      }),
    );
    const { errors } = validateResult.payload as ValidationModel;

    if(errors[error] && errors[error].length > 0){
      showFormError(input,errors[error][0]);
    }

  }

  return (
    <div className={styles['responsible_information_wrapper']}>
              <InputBase
                data-testid="responsible-name"
                label="Nome completo do responsável"
                placeholder="Nome completo do responsável"
                value={responsabileInformation.name}
                onChange={e => {handleNameChange(responsibleFormatterName(e.target.value))}}
                onBlur={() => validate('name','nameResponsible')}
                errorMessage={errors.name && errors.name[0]}

              />
              <InputBase
               data-testid="responsible-cpf"
                label="CPF"
                placeholder="CPF"
                value={responsabileInformation.cpf}
                onChange={e => {handleCpfChange(cpfFormatter(e.target.value))}}
                onBlur={() => validate('cpf','documentNumber')}
                errorMessage={errors.cpf && errors.cpf[0]}
              />
              <InputBase
               data-testid="responsible-phone"
                label="Telefone"
                placeholder="Telefone"
                value={responsabileInformation.phone}
                onChange={e => {handlePhoneNumberChange(phoneFormatter(e.target.value))}}
                onBlur={() => validate('phone','phone')}
                errorMessage={errors.phone && errors.phone[0]}
              />
              <InputBase
               data-testid="responsible-email"
                label="E-mail"
                placeholder="E-mail"
                value={responsabileInformation.email}
                onChange={e => {handleEmailChange(e.target.value)}}
                onBlur={() => validate('email','email')}
                errorMessage={errors.email && errors.email[0]}
              />
              <div className={styles['responsible_information_button']}>
                <Button
                  data-testid="button-responsible-information-registry"
                  onClick={() => onSubmit()}
                  disabled={isDisableGoNextStep}
                  >
                  Avançar
                  </Button>
              </div>
    </div>
  );
};

export default ResponsibleInformation;

/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { InputBase, Button,Checkbox,LinkButton,Modal } from 'junto-design-system';
import { cpfFormatter, phoneFormatter } from '@shared/utils';
import { ValidationModel } from 'modules/broker-signup/src/application/types/model';
import styles from './ResponsibleInformation.module.scss';
import { responsibleFormatterName } from '../../../helpers';
import { useAppDispatch } from '../../../config/store';
import { responsibleInformationSliceActions, selectResponsibleInformation } from '../../../application/features/responsibleInformation/ResponsibleInformationSlice';
import { validationActions, selectValidation,validateForm } from '../../../application/features/validation/ValidationSlice';
import {  ResponsibleInformationDataSchema } from '../../../application/features/validations/schemas/componentSchemas';
import { TERMS_RESPONSIBILITY } from '../../../constants/termsResponsibility'

export interface ResponsibleInformationProps {
  onSubmit: () => void;
}

export function ResponsibleInformation({
  onSubmit,
}: ResponsibleInformationProps) {
  const [isDisableGoNextStep, setIsDisableGoNextStep] = useState(true);
  const dispatch = useAppDispatch();
  const responsabileInformation = useSelector(selectResponsibleInformation);
  const { errors } = useSelector(selectValidation);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {nameResponsable, cpfResponsable, phoneNumberResponsable, emailBroker} = responsabileInformation;

  useEffect(() => {
    const hasNotInputEmpty = nameResponsable !== '' && emailBroker !== ''&& cpfResponsable !== '' && phoneNumberResponsable !== ''
    const hasInputError = Object.values(errors).length
    if(hasNotInputEmpty && hasInputError === 0 && responsabileInformation.termsResponsibility){
     setIsDisableGoNextStep(false);
    }
    if(!responsabileInformation.termsResponsibility){
      setIsDisableGoNextStep(true);
    }
  }, [errors, responsabileInformation.termsResponsibility, nameResponsable, emailBroker, cpfResponsable, phoneNumberResponsable]);

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

  const handleCheckboxStatus = (value: boolean) => {
    dispatch(responsibleInformationSliceActions.setTermsResponsibility(value));
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
          nameResponsible: nameResponsable,
          documentNumber: cpfResponsable,
          phone: phoneNumberResponsable,
          email: emailBroker
        },
      }),
    );
    const { errors } = validateResult.payload as ValidationModel;

    if(errors[error] && errors[error].length > 0){
      showFormError(input,errors[error][0]);
    }

  }
  const templateModal = {
    title: { value: TERMS_RESPONSIBILITY.title},
    text:  { value: TERMS_RESPONSIBILITY.text},
  }
  return (
    <div className={styles['responsible_information_wrapper']}>
              <InputBase
                data-testid="responsible-name"
                label="Nome completo do responsável"
                placeholder="Nome completo do responsável"
                value={nameResponsable}
                onChange={e => {handleNameChange(responsibleFormatterName(e.target.value))}}
                onBlur={() => validate('name','nameResponsible')}
                errorMessage={errors.name && errors.name[0]}

              />
              <InputBase
               data-testid="responsible-cpf"
                label="CPF"
                placeholder="CPF"
                value={cpfResponsable}
                onChange={e => {handleCpfChange(cpfFormatter(e.target.value))}}
                onBlur={() => validate('cpf','documentNumber')}
                errorMessage={errors.cpf && errors.cpf[0]}
              />
              <InputBase
               data-testid="responsible-phone"
                label="Telefone"
                placeholder="Telefone"
                value={phoneNumberResponsable}
                onChange={e => {handlePhoneNumberChange(phoneFormatter(e.target.value))}}
                onBlur={() => validate('phone','phone')}
                errorMessage={errors.phone && errors.phone[0]}
              />
              <InputBase
               data-testid="responsible-email"
                label="E-mail"
                placeholder="E-mail"
                value={emailBroker}
                onChange={e => {handleEmailChange(e.target.value)}}
                onBlur={() => validate('email','email')}
                errorMessage={errors.email && errors.email[0]}
              />
              <div className={styles['responsible_information_terms']}>
                <Checkbox
                id="chk-select-all"
                checked={responsabileInformation.termsResponsibility}
                onChange={checked => handleCheckboxStatus(checked)}
                />
                <span className={styles['span_terms']}>Li e aceito o&nbsp;</span>
                <LinkButton
                  onClick={() => setIsOpen(true)}
                  label="termo de responsabilidade"
                />
              </div>
              <Modal
                size="large"
                open={isOpen}
                template={templateModal}
                onBackdropClick={() =>  setIsOpen(false)}
                onClose={() => setIsOpen(false)}
              />
              <div className={styles['responsible_information_button']}>
                <Button
                  data-testid="button-responsible-information-registry"
                  onClick={onSubmit}
                  disabled={isDisableGoNextStep}
                  >
                  Avançar
                  </Button>
              </div>
    </div>
  );
};

export default ResponsibleInformation;

/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  InputBase,
  Button,
  Checkbox,
  LinkButton,
  Modal,
} from 'junto-design-system';
import { ValidationModel } from 'modules/broker-signup/src/application/types/model';
import styles from './BrokerEmail.module.scss';
import { responsibleFormatterName } from '../../../helpers';
import { useAppDispatch } from '../../../config/store';
import {
  responsibleInformationSliceActions,
  selectResponsibleInformation,
} from '../../../application/features/responsibleInformation/ResponsibleInformationSlice';
import {
  validationActions,
  selectValidation,
  validateForm,
} from '../../../application/features/validation/ValidationSlice';
import { BrokerEmailDataSchema } from '../../../application/features/validations/schemas/componentSchemas';
import { TERMS_RESPONSIBILITY } from '../../../constants/termsResponsibility';
import RegisterBrokerApi from '../../../application/features/RegisterBroker/RegisterBrokerApi';
import { VALIDATION_MESSAGES } from '../../../constants/validationMessages';

export interface BrokerEmailProps {
  onSubmit: () => void;
}

export function BrokerEmail({ onSubmit }: BrokerEmailProps) {
  const [isDisableGoNextStep, setIsDisableGoNextStep] = useState(true);
  const dispatch = useAppDispatch();
  const responsabileInformation = useSelector(selectResponsibleInformation);
  const { errors } = useSelector(selectValidation);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { nameResponsable, emailBroker } = responsabileInformation;

  useEffect(() => {
    const hasNotInputEmpty = nameResponsable !== '' && emailBroker !== '';
    const hasInputError = Object.values(errors).length;
    if (
      hasNotInputEmpty &&
      hasInputError === 0 &&
      responsabileInformation.termsResponsibility
    ) {
      setIsDisableGoNextStep(false);
    }
    if (!responsabileInformation.termsResponsibility) {
      setIsDisableGoNextStep(true);
    }
  }, [
    errors,
    responsabileInformation.termsResponsibility,
    nameResponsable,
    emailBroker,
  ]);

  const handleNameChange = (value: string) => {
    dispatch(responsibleInformationSliceActions.setName(value));
    dispatch(validationActions.removeErrorMessage('name'));
  };
  const handleEmailChange = (value: string) => {
    dispatch(responsibleInformationSliceActions.setEmail(value));
    dispatch(validationActions.removeErrorMessage('email'));
  };

  const handleCheckboxStatus = (value: boolean) => {
    dispatch(responsibleInformationSliceActions.setTermsResponsibility(value));
  };

  const validateName = async () => {
    const validateResult = await dispatch(
      validateForm({
        schema: BrokerEmailDataSchema,
        data: {
          nameResponsible: nameResponsable,
          email: emailBroker,
        },
      }),
    );
    const { errors } = validateResult.payload as ValidationModel;
    if (errors.nameResponsible && errors.nameResponsible.length > 0) {
      dispatch(
        validationActions.setErrorMessages({
          name: [errors['nameResponsible'][0]],
        }),
      );
    }
  };

  const validateEmail = async () => {
    const validateResult = await dispatch(
      validateForm({
        schema: BrokerEmailDataSchema,
        data: {
          nameResponsible: nameResponsable,
          email: emailBroker,
        },
      }),
    );
    const { errors } = validateResult.payload as ValidationModel;

    if (errors['email'] && errors['email'].length > 0) {
      dispatch(
        validationActions.setErrorMessages({
          email: [errors['email'][0]],
        }),
      );
      return;
    }
    await RegisterBrokerApi.checkEmailExists(emailBroker).then(response => {
      if (response) {
        dispatch(
          validationActions.setErrorMessages({
            email: [VALIDATION_MESSAGES.emailExist],
          }),
        );
      }
    });
  };
  const templateModal = {
    title: { value: TERMS_RESPONSIBILITY.title },
    text: { value: TERMS_RESPONSIBILITY.text },
  };
  return (
    <div className={styles['broker_email_wrapper']}>
      <InputBase
        data-testid="responsible-name"
        label="Nome completo"
        placeholder=""
        value={nameResponsable}
        onChange={e => {
          handleNameChange(responsibleFormatterName(e.target.value));
        }}
        onBlur={() => validateName()}
        errorMessage={errors.name && errors.name[0]}
      />
      <InputBase
        data-testid="responsible-email"
        label="E-mail da corretora"
        placeholder=""
        value={emailBroker}
        onChange={e => {
          handleEmailChange(e.target.value);
        }}
        onBlur={() => validateEmail()}
        errorMessage={errors.email && errors.email[0]}
      />
      <div className={styles['broker_email_terms']}>
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
        onBackdropClick={() => setIsOpen(false)}
        onClose={() => setIsOpen(false)}
      />
      <div className={styles['broker_email_button']}>
        <Button
          data-testid="button-responsible-information-registry"
          onClick={onSubmit}
          disabled={isDisableGoNextStep}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}

export default BrokerEmail;

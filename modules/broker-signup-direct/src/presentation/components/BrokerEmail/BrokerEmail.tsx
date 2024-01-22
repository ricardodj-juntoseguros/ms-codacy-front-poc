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
import { VALIDATION_EMAIL_MODAL } from '../../../constants/validationEmailModal';
import RegisterBrokerApi from '../../../application/features/RegisterBroker/RegisterBrokerApi';
import { VALIDATION_MESSAGES } from '../../../constants/validationMessages';
import LoadingSpinner from '../LoadingSpinner';
import { EMAIL_PROVIDER_LIST } from '../../../constants/emailProviderList';
import { selectBroker } from '../../../application/features/brokerInformation/BrokerInformationSlice';

export interface BrokerEmailProps {
  isSubmitting: boolean;
  onSubmit: () => void;
}

export function BrokerEmail({ onSubmit, isSubmitting }: BrokerEmailProps) {
  const [isDisableGoNextStep, setIsDisableGoNextStep] = useState(true);
  const dispatch = useAppDispatch();
  const responsabileInformation = useSelector(selectResponsibleInformation);
  const { errors } = useSelector(selectValidation);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalValidationEmail, setModalValidationEmail] =
    useState<boolean>(false);

  const { nameResponsable, emailBroker } = responsabileInformation;
  const privacyPolicyUrl = 'https://www.juntoseguros.com/politica-privacidade/';
  const broker = useSelector(selectBroker);

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

  const handleGoToPrivacyPolicy = () => {
    window.location.assign(privacyPolicyUrl);
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
        setIsDisableGoNextStep(true);
      }
    });
  };
  const handleSubmit = () => {
    const validationEmailType = compareEmailBrokerToEmailResponsible();
    setModalValidationEmail(!validationEmailType);

    if (validationEmailType) {
      onSubmit();
    }
  };
  const compareEmailBrokerToEmailResponsible = () => {
    const responsibleEmailDomain = responsabileInformation.emailBroker
      .trim()
      .split('@');

    if (broker.information.email.length > 0) {
      if (
        broker.information.email &&
        responsabileInformation.emailBroker &&
        broker.information.email?.toUpperCase() ===
          responsabileInformation.emailBroker?.toUpperCase()
      )
        return true;

      const brokerEmailDomain = broker.information.email.trim().split('@');

      if (brokerEmailDomain.length < 1 || responsibleEmailDomain.length < 1)
        return false;

      if (
        !EMAIL_PROVIDER_LIST.includes(responsibleEmailDomain[1].toUpperCase())
      )
        return true;

      return false;
    }

    return !EMAIL_PROVIDER_LIST.includes(
      responsibleEmailDomain[1].toUpperCase(),
    );
  };
  const templateModal = {
    title: { value: TERMS_RESPONSIBILITY.title },
    text: { value: TERMS_RESPONSIBILITY.text },
  };

  const getModalButtons = () => {
    const primaryText = 'Alterar e-mail';
    const secondaryText = 'Manter e-mail informado';
    const primaryAction = () => setModalValidationEmail(false);
    const secondaryAction = () => onSubmit();

    return {
      primary: (
        <Button
          id="registerResponsible-updateEmail-modalButton"
          data-testid="modal-validation-email-handle-email-button"
          onClick={primaryAction}
        >
          {primaryText}
        </Button>
      ),
      secondary: (
        <Button
          id="registerResponsible-handleEmail-modalButton"
          data-testid="modal-validation-email-handle-email-button"
          variant="secondary"
          onClick={secondaryAction}
          loading={isSubmitting}
        >
          {secondaryText}
        </Button>
      ),
    };
  };

  const templateModalValidationEmail = {
    title: { value: VALIDATION_EMAIL_MODAL.title, align: 'center' as any },
    text: { value: VALIDATION_EMAIL_MODAL.text, align: 'center' as any },
    buttons: getModalButtons(),
  };

  return (
    <div className={styles['broker_email_wrapper']}>
      <InputBase
        id="registerResponsible-name-input"
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
        id="registerResponsible-email-input"
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
      <div
        className={styles['broker_email_terms']}
        id="registerResponsible-termsResponsibility-checkbox"
      >
        <Checkbox
          id="chk-select-all"
          checked={responsabileInformation.termsResponsibility}
          onChange={checked => handleCheckboxStatus(checked)}
        />
        <div>
          <span className={styles['span_terms']}>Li e aceito o&nbsp;</span>
          <LinkButton
            id="registerResponsible-termsResponsibility-linkButton"
            onClick={() => setIsOpen(true)}
            label="termo de responsabilidade"
          />
          <span className={styles['span_terms']}>&nbsp;e&nbsp;</span>
          <LinkButton
            id="registerResponsible-privacyPolicy-linkButton"
            data-testid="privacy-policy-button"
            onClick={() => handleGoToPrivacyPolicy()}
            label="política de privacidade"
          />
        </div>
      </div>
      <div id="registerResponsible-validationEmail-modal">
        <Modal
          open={modalValidationEmail}
          onClose={() => {
            setModalValidationEmail(!modalValidationEmail);
          }}
          onBackdropClick={() => {
            setModalValidationEmail(!modalValidationEmail);
          }}
          size="default"
          template={templateModalValidationEmail}
        />
      </div>
      <div id="registerResponsible-termsResponsibility-modal">
        <Modal
          size="large"
          open={isOpen}
          template={templateModal}
          onBackdropClick={() => setIsOpen(false)}
          onClose={() => setIsOpen(false)}
        />
      </div>
      <div className={styles['broker_email_button']}>
        <Button
          id="registerResponsible-submit-button"
          data-testid="button-responsible-information-registry"
          onClick={handleSubmit}
          disabled={isDisableGoNextStep}
        >
          {isSubmitting ? ((<LoadingSpinner />) as any) : 'Continuar'}
        </Button>
      </div>
    </div>
  );
}

export default BrokerEmail;

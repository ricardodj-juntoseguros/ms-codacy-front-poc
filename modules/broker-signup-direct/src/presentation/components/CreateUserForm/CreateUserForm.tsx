import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { InputBase, Button, Alert, makeToast } from 'junto-design-system';
import styles from './CreateUserForm.module.scss';
import LoadingSpinner from '../LoadingSpinner';
import { useAppDispatch } from '../../../config/store';
import RegisterBrokerApi from '../../../application/features/RegisterBroker/RegisterBrokerApi';
import {
  selectBroker,
  brokerInformationSliceActions,
} from '../../../application/features/brokerInformation/BrokerInformationSlice';
import { ReactComponent as RuleNotCheck } from '../../assets/circle-red.svg';
import { ReactComponent as RuleCheck } from '../../assets/circle-green.svg';
import { VALIDATION_MESSAGES } from '../../../constants/validationMessages';
import { PasswordSchema } from '../../../application/features/validations/schemas/componentSchemas/common';
import {
  ValidationErrorModel,
  ValidationModel,
} from '../../../application/types/model/ValidationModel';
import { validateForm } from '../../../application/features/validation/ValidationSlice';
import { RegisterBrokerNewUserDTO } from '../../../application/types/dto';

export interface CreateUserFormProps {
  handleGoNextClick(): void;
  hash?: string;
  token?: string;
  guid?: string;
}

export function CreateUserForm({
  handleGoNextClick,
  hash,
  token,
  guid,
}: CreateUserFormProps) {
  const dispatch = useAppDispatch();
  const brokerInformation = useSelector(selectBroker);
  const [brokerUserName, setBrokerUserNmae] = useState('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showConfirmPassword, setshowConfirmPassword] =
    useState<boolean>(false);
  const [showValidation, setShowValidation] = useState(false);
  const [isDisableButtonSignup, setIsDisableButtonSignup] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrorUserName, setShowErrorUserName] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [errors, setErrors] = useState<ValidationErrorModel>(
    {} as ValidationErrorModel,
  );
  const [errorUserName, setErrorUserName] = useState<string>('');
  const sreenWidthMobile = window.screen.width;
  const now = new Date();

  useEffect(() => {
    if (password !== '' || confirmPassword !== '') {
      setShowValidation(true);
      validatePasswold();
    }
  }, [brokerUserName, password, confirmPassword]);

  useEffect(() => {
    if (showAlert && brokerUserName.length > 0 && !showErrorUserName) {
      setIsDisableButtonSignup(false);
    } else {
      setIsDisableButtonSignup(true);
    }
  });

  useEffect(() => {
    validateBrokerUserName(brokerUserName);
  }, [brokerUserName]);

  const showErrorUser = () => {
    if (errorUserName !== '') {
      setShowErrorUserName(true);
    } else if (brokerUserName !== '' && showAlert) {
      setShowErrorUserName(false);
    }
  };

  const validateBrokerUserName = async (userName: string) => {
    const regex = /\W|_/;
    if (userName === '') {
      setErrorUserName('');
      return;
    }
    if (userName.length < 5) {
      setErrorUserName(VALIDATION_MESSAGES.userMinChar);
      return;
    }
    if (userName.length > 50) {
      setErrorUserName(VALIDATION_MESSAGES.userMaxChar);
      return;
    }
    if (userName?.match(regex)) {
      setErrorUserName(VALIDATION_MESSAGES.userSpecialChar);
      return;
    }
    validateUserName(brokerUserName);
  };

  const validateUserName = async (userName: string) => {
    setIsDisableButtonSignup(true);
    await RegisterBrokerApi.validateUser(userName)
      .then(() => {
        setErrorUserName('');
        setShowErrorUserName(false);
      })
      .catch(() => {
        setErrorUserName(VALIDATION_MESSAGES.userExists);
      });
  };

  const validatePasswold = async () => {
    setShowAlert(false);
    const validateResult = await dispatch(
      validateForm({
        schema: PasswordSchema,
        data: {
          userName: brokerUserName,
          name: brokerInformation.information.brokerCompanyName,
          password,
          confirmPassword,
        },
      }),
    );

    const { errors } = validateResult.payload as ValidationModel;

    const { isValidForm } = validateResult.payload as ValidationModel;

    if (isValidForm) {
      setShowAlert(true);
      setShowValidation(false);
    } else {
      setErrors(errors);
    }
  };

  const HandlerClickPassword = () => {
    setShowPassword(!showPassword);
  };

  const HandlerClickConfirmPassword = () => {
    setshowConfirmPassword(!showConfirmPassword);
  };

  const renderIconCheckPassword = (errorType: string) => {
    if (errors.password && errors.password.includes(errorType)) {
      return <RuleNotCheck data-testid="create-user-form-ruleicon-notcheck" />;
    }
    return <RuleCheck data-testid="create-user-form-ruleicon-check" />;
  };

  const renderStyleRuleChekPassword = (errorType: string) => {
    if (errors.password && errors.password.includes(errorType)) {
      return 'create-user-form-validation_password_rule_text_not_check';
    }
    return 'create-user-form-validation_password_rule_text_check';
  };

  const fetchRegisterBrokerInformation = async () => {
    const brokerGuid =
      brokerInformation.pathUpdate !== '' ? brokerInformation.pathUpdate : guid;
    const payload = [
      {
        op: 'replace',
        path: '/endSignup',
        value: now,
      },
    ];
    await RegisterBrokerApi.updateRegisterBroker(
      [...payload],
      brokerGuid || '',
    );
  };

  const onSubmit = async () => {
    let payload = {
      login: brokerUserName,
      password,
      confirmPassword,
      acceptTerms: true,
      brokerAutomaticSignup: true,
    } as RegisterBrokerNewUserDTO;

    if (hash && token) {
      payload = {
        ...payload,
        hash,
        token,
      };
    } else {
      payload = {
        ...payload,
        _brokerExternalId: brokerInformation.brokerExternalId,
      };
    }

    setIsSubmitting(true);
    setIsDisableButtonSignup(true);
    await RegisterBrokerApi.createNewUser(payload)
      .then(() => {
        dispatch(
          brokerInformationSliceActions.setBrokerUserName(brokerUserName),
        );
        fetchRegisterBrokerInformation();
        handleGoNextClick();
      })
      .catch(error => {
        if (error.status === 504) {
          dispatch(
            brokerInformationSliceActions.setBrokerUserName(brokerUserName),
          );
          fetchRegisterBrokerInformation();
          handleGoNextClick();
        } else {
          setIsSubmitting(false);
          setIsDisableButtonSignup(false);
          makeToast(
            'error',
            'Ops, parece que algo deu errado. Tente novamente.',
          );
        }
      });
  };

  return (
    <div className={styles['create-user-form-wrapper']}>
      <div
        id="createUserAccess-brokerLogin-input"
        className={styles['create-user-form-fileds']}
      >
        <InputBase
          data-testid="broker-userName"
          label="Crie um nome de usuário"
          placeholder=" "
          value={brokerUserName}
          onChange={e => setBrokerUserNmae(e.target.value)}
          onBlur={() => showErrorUser()}
          errorMessage={showErrorUserName ? errorUserName : ''}
        />
      </div>
      <div
        id="createUserAccess-brokerPassword-input"
        className={styles['create-user-form-fileds']}
      >
        <InputBase
          data-testid="broker-Password"
          label="Crie uma senha"
          placeholder=" "
          icon={!showPassword ? 'eye-off' : 'eye'}
          onChange={e => setPassword(e.target.value)}
          value={password}
          type={!showPassword ? 'password' : ''}
          onActionIconClick={HandlerClickPassword}
        />
      </div>
      <div id="createUserAccess-brokerConfirmPassword-input">
        <InputBase
          data-testid="broker-ConfirmPassword"
          label="Confirme a senha"
          placeholder=" "
          icon={!showConfirmPassword ? 'eye-off' : 'eye'}
          onChange={e => setConfirmPassword(e.target.value)}
          value={confirmPassword}
          type={!showConfirmPassword ? 'password' : ''}
          onActionIconClick={HandlerClickConfirmPassword}
        />
      </div>
      {showValidation && (
        <div className={styles['create-user-form-validation_password']}>
          <h1>A senha deve conter:</h1>
          <div className={styles['create-user-form-validation_password_rule']}>
            <div>
              {renderIconCheckPassword(VALIDATION_MESSAGES.minChar)}
              <span
                className={
                  styles[
                    renderStyleRuleChekPassword(VALIDATION_MESSAGES.minChar)
                  ]
                }
              >
                {' '}
                Mínimo de 10 caracteres{' '}
              </span>
            </div>
            <div>
              {renderIconCheckPassword(VALIDATION_MESSAGES.differentUserName)}
              <span
                className={
                  styles[
                    renderStyleRuleChekPassword(
                      VALIDATION_MESSAGES.differentUserName,
                    )
                  ]
                }
              >
                {' '}
                Diferente do usuário{' '}
              </span>
            </div>
            <div>
              {renderIconCheckPassword(
                VALIDATION_MESSAGES.differentCompanyName,
              )}
              <span
                className={
                  styles[
                    renderStyleRuleChekPassword(
                      VALIDATION_MESSAGES.differentCompanyName,
                    )
                  ]
                }
              >
                {' '}
                Diferente do nome ou parte do nome da corretora{' '}
              </span>
            </div>
            <div>
              {renderIconCheckPassword(VALIDATION_MESSAGES.notNumberSequence)}
              <span
                className={
                  styles[
                    renderStyleRuleChekPassword(
                      VALIDATION_MESSAGES.notNumberSequence,
                    )
                  ]
                }
              >
                {' '}
                Sem sequência (123456...){' '}
              </span>
            </div>
            <div>
              {renderIconCheckPassword(VALIDATION_MESSAGES.specialChar)}
              <span
                className={
                  styles[
                    renderStyleRuleChekPassword(VALIDATION_MESSAGES.specialChar)
                  ]
                }
              >
                {' '}
                Um caractere especial (&*ˆ$...){' '}
              </span>
            </div>
            <div>
              {renderIconCheckPassword(VALIDATION_MESSAGES.samePasswords)}
              <span
                className={
                  styles[
                    renderStyleRuleChekPassword(
                      VALIDATION_MESSAGES.samePasswords,
                    )
                  ]
                }
              >
                {' '}
                As duas senhas precisam ser iguais{' '}
              </span>
            </div>
            <div>
              {renderIconCheckPassword(VALIDATION_MESSAGES.min3charDifferent)}
              <span
                className={
                  styles[
                    renderStyleRuleChekPassword(
                      VALIDATION_MESSAGES.min3charDifferent,
                    )
                  ]
                }
              >
                {' '}
                3 tipos de caracteres diferentes (maiúsculas, minúsculas e
                números){' '}
              </span>
            </div>
          </div>
        </div>
      )}
      {showAlert && (
        <div className={styles['create-user-form-alert']}>
          <Alert
            data-testid="alert-error-register-broker-login"
            variant="success"
            arrow="top-start"
            width={sreenWidthMobile > 680 ? 360 : sreenWidthMobile - 48}
            text="Legal! Você criou uma senha forte e segura."
            icon="check-circle"
          />
        </div>
      )}

      <div className={styles['create-user-form-button-finish_wrapper']}>
        <Button
          id="createUserAccess-submit-button"
          data-testid="button-register-broker-login"
          onClick={() => onSubmit()}
          disabled={isDisableButtonSignup}
        >
          {isSubmitting ? ((<LoadingSpinner />) as any) : 'Cadastrar'}
        </Button>
      </div>
    </div>
  );
}

export default CreateUserForm;

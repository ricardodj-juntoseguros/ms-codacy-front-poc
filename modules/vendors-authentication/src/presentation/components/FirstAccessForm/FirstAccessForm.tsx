/* eslint-disable camelcase */
import { useState, useEffect } from 'react';
import {
  Button,
  InputBase,
  LinkButton,
  Checkbox,
  Modal,
  makeToast,
} from 'junto-design-system';
import { VendorsAuthService } from '@services';
import { useHistory } from 'react-router-dom';
import styles from './FirstAccessForm.module.scss';
import AuthApi from '../../../application/features/auth/AuthApi';
import TermsApi from '../../../application/features/terms/TermsApi';
import LoadingSpinner from '../LoadingSpinner';
import { TERMS_RESPONSIBILITY } from '../../../constants/termsResponsibility';
import { VALIDATION_MESSAGES } from '../../../constants/validationMessages';
import { ReactComponent as RuleNotCheck } from '../../assets/circle-red.svg';
import { ReactComponent as RuleCheck } from '../../assets/circle-green.svg';
import { validate } from '../../../application/validations/validate';
import { PasswordSchema } from '../../../application/validations/schemas/componentSchemas/common';
import { ValidationErrorModel } from '../../../application/types/model/ValidationModel';
import { TermsDTO } from '../../../application/types/dto';

export interface FirstAccessProps {
  hash: string;
  token: string;
}

export function FirstAccessForm({ hash, token }: FirstAccessProps) {
  const [errors, setErrors] = useState<ValidationErrorModel>(
    {} as ValidationErrorModel,
  );
  const [terms, setTerms] = useState<string>('');
  const [termId, setTermId] = useState<number>();
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [termsResponsibility, setTermsResponsibility] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showConfirmPassword, setshowConfirmPassword] =
    useState<boolean>(false);
  const [showValidation, setShowValidation] = useState(false);
  const [showTerms, setShowTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDisabledButton, setIsDisabledButton] = useState(true);
  const history = useHistory();
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    if (hash !== '' && token !== '') {
      const hashData = atob(hash.replace('%3D', '').replace('%3D', ''));
      setUserEmail(hashData.split(':')[0]);
      validateTerms();
    }
  }, [hash, token, userEmail]);

  useEffect(() => {
    if (password !== '' || confirmPassword !== '') {
      setShowValidation(true);
      validatePasswold();
    }
  }, [password, confirmPassword, termsResponsibility]);

  const validatePasswold = async () => {
    const result = await validate(PasswordSchema, {
      email: userEmail,
      password,
      confirmPassword,
    });
    setErrors(result.errors);

    if (!showTerms) {
      setIsDisabledButton(false);
    } else if (result.isValidForm && termsResponsibility) {
      setIsDisabledButton(false);
    } else {
      setIsDisabledButton(true);
    }
  };

  const validateTerms = async () => {
    await TermsApi.getAcceptTerms(userEmail, TERMS_RESPONSIBILITY.name)
      .then(Response => {
        if (Response.data.length > 0) {
          getTerm(Response);
          setShowTerms(true);
          return;
        }
        setIsDisabledButton(false);
        setShowTerms(false);
      })
      .catch(() => {
        setIsDisabledButton(false);
        setShowTerms(false);
      });
  };

  const getTerm = async (term: TermsDTO) => {
    setTermId(term?.data[0].id || 0);
    await TermsApi.getTerm(term, TERMS_RESPONSIBILITY.name)
      .then(Response => {
        setTerms(Response);
      })
      .catch(() => setShowTerms(true));
  };

  const HandlerClickPassword = () => {
    setShowPassword(!showPassword);
  };

  const HandlerClickConfirmPassword = () => {
    setshowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    if (showTerms) {
      AcceptTerms();
    } else {
      ResetPassword();
    }
  };

  const AcceptTerms = async () => {
    await TermsApi.postAccept(userEmail, termId || 0)
      .then(() => {
        ResetPassword();
      })
      .catch(() => {
        setIsSubmitting(false);
        makeToast('error', 'Ops, parece que algo deu errado. Tente novamente.');
      });
  };

  const ResetPassword = async () => {
    await AuthApi.resetPassword(hash, token, password)
      .then(() => {
        handleLogin();
        history.push('/first-access-finish');
      })
      .catch(() => {
        setIsSubmitting(false);
        makeToast('error', 'Ops, parece que algo deu errado. Tente novamente.');
      });
  };

  const handleLogin = async () => {
    setIsSubmitting(true);
    await AuthApi.postAuth(userEmail, password)
      .then(
        ({ access_token, refresh_token, expires_in, refresh_expires_in }) => {
          VendorsAuthService.setUserAccessCookie(
            access_token,
            refresh_token,
            expires_in,
            refresh_expires_in,
          );
        },
      )
      .catch(() => history.push('/'));
    setIsSubmitting(false);
  };

  const templateModal = {
    title: { value: TERMS_RESPONSIBILITY.title },
    text: { value: terms },
  };

  const renderIconCheckPassword = (errorType: string) => {
    if (errors.password && errors.password.includes(errorType)) {
      return <RuleNotCheck data-testid="firstAccess-ruleicon-notcheck" />;
    }
    return <RuleCheck data-testid="firstAccess-ruleicon-check" />;
  };

  return (
    <div className={styles['first_access_wrapper']}>
      <h1 className={styles['first_access_title']}>
        Para sua segurança, precisamos que você defina uma senha.
      </h1>
      <div className={styles['first_access_form']}>
        <InputBase
          data-testid="first_access-input-password"
          label="Digite sua senha"
          placeholder=" "
          icon={!showPassword ? 'eye-off' : 'eye'}
          onChange={e => setPassword(e.target.value)}
          value={password}
          type={!showPassword ? 'password' : ''}
          onActionIconClick={HandlerClickPassword}
        />
        <InputBase
          data-testid="first_access-input-confirmPassword"
          label="Confirme sua senha"
          placeholder=" "
          icon={!showConfirmPassword ? 'eye-off' : 'eye'}
          onChange={e => setConfirmPassword(e.target.value)}
          value={confirmPassword}
          type={!showConfirmPassword ? 'password' : ''}
          onActionIconClick={HandlerClickConfirmPassword}
        />
        {showValidation && (
          <div className={styles['first_access_validation_password']}>
            <div className={styles['first_access_validation_password_rule']}>
              <div>
                {renderIconCheckPassword(VALIDATION_MESSAGES.minChar)}
                <span
                  className={
                    styles['first_access_validation_password_rule_text']
                  }
                >
                  {' '}
                  Mínimo de 10 caracteres{' '}
                </span>
              </div>
              <div>
                {renderIconCheckPassword(VALIDATION_MESSAGES.differentEmail)}
                <span
                  className={
                    styles['first_access_validation_password_rule_text']
                  }
                >
                  {' '}
                  Diferente do e-mail{' '}
                </span>
              </div>
              <div>
                {renderIconCheckPassword(VALIDATION_MESSAGES.notNumberSequence)}
                <span
                  className={
                    styles['first_access_validation_password_rule_text']
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
                    styles['first_access_validation_password_rule_text']
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
                    styles['first_access_validation_password_rule_text']
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
                    styles['first_access_validation_password_rule_text']
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
        {showTerms && (
          <div className={styles['first_access_terms']}>
            <Checkbox
              id="first_access-checkbox-TermsResponsibility"
              data-testId="first_access-checkbox-TermsResponsibility"
              checked={termsResponsibility}
              onChange={checked => setTermsResponsibility(checked)}
            />
            <span className={styles['span_terms']}>Li e aceito o&nbsp;</span>
            <LinkButton
              onClick={() => setIsOpen(true)}
              label="termo de responsabilidade"
            />
          </div>
        )}
        <Modal
          size="large"
          open={isOpen}
          template={templateModal}
          onBackdropClick={() => setIsOpen(false)}
          onClose={() => setIsOpen(false)}
        />
        <div>
          <Button
            disabled={isDisabledButton}
            data-testid="first_access-button-finish"
            onClick={() => handleSubmit()}
            type="submit"
            fullWidth
          >
            {isSubmitting ? ((<LoadingSpinner />) as any) : 'Entrar'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FirstAccessForm;

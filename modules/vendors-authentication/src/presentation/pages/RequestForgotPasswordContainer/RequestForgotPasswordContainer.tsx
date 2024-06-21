import { useState } from 'react';
import { Button,InputBase,LinkButton,makeToast } from "junto-design-system";
import { useHistory } from 'react-router-dom';
import { emailValidator } from '@shared/utils';
import styles from './RequestForgotPasswordContainer.module.scss';
import { ReactComponent as LogoVendors } from '../../assets/logoVendors.svg';
import LoadingSpinner from '../../components/LoadingSpinner';
import AuthApi from '../../../application/features/auth/AuthApi';

function RequestForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const history = useHistory();
  const [isEmail, setisEmail] = useState(true);

  const handleGoPageLogin = () => {
    history.push('/');
  };

  const handleSubmit = async () => {
    if(emailValidator(email)){
      setIsSubmitting(true);
      await AuthApi.forgotPassword(email)
        .then(() =>   history.push('/request-forgot-password-finish'))
        .catch(() =>{
          setIsSubmitting(false);
          makeToast(
            'error',
            'Ops, parece que algo deu errado. Tente novamente.',
          )
          })
        setIsSubmitting(false);
    }
    else{
    setisEmail(false)
    }
  };

  const handleChangeEmail = (email: string) => {
    setisEmail(true)
    setEmail(email)
  };


  return (
    <div className={styles['request_forgot_password_container__wrapper']}>
        <LogoVendors />
        <h1 className={styles['request_forgot_password_title']}>Confirme seu e-mail para recuperar seu acesso.</h1>
        <div
        className={styles['request_forgot_password__form']}
        >
        <InputBase
            data-testid="loginForm-input-login"
            label="E-mail"
            placeholder=" "
            onChange={(e) => handleChangeEmail(e.target.value)}
            value={email}
            errorMessage={!isEmail ? 'Digite um e-mail válido' : ''}
          />
          <div>
            <Button
            data-testid="loginForm-button-login"
            onClick={() => handleSubmit()}
            type="submit" fullWidth>
            {isSubmitting
                    ? ((<LoadingSpinner />) as any)
                    : "Recuperar acesso"}
            </Button>
          </div>
          <div className={styles['forgot_passowrd_redirect']}>
            <LinkButton label="Voltar ao login" onClick={() => handleGoPageLogin()}/>
          </div>
        </div>
   </div>
  );
}

export default RequestForgotPassword;

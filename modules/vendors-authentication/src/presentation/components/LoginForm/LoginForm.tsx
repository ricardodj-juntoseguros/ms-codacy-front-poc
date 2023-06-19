/* eslint-disable camelcase */
import { useState } from 'react';
import { Button, InputBase, LinkButton, Alert } from 'junto-design-system';
import { VendorsAuthService } from '@services';
import styles from './LoginForm.module.scss';
import AuthApi from '../../../application/features/auth/AuthApi';
import LoadingSpinner from '../LoadingSpinner';

export function LoginForm() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const HandlerClick = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (login: string, password: string) => {
    setIsSubmitting(true);
    await AuthApi.postAuth(login, password)
      .then(response => {
        const { access_token, refresh_token, refresh_expires_in, expires_in } =
          response;
        VendorsAuthService.setUserAccessCookie(
          access_token,
          refresh_token,
          expires_in,
          refresh_expires_in,
        );
        const redirectUrl = VendorsAuthService.getRedirectPageAfterLogin();
        window.location.assign(redirectUrl);
      })
      .catch(() => setShowAlert(true));
    setIsSubmitting(false);
  };

  return (
    <div className={styles['login__wrapper']}>
      <h1 className={styles['login_title']}>
        Seja bem-vindo. Faça seu login para continuar.
      </h1>
      <div className={styles['login__form']}>
        <InputBase
          data-testid="loginForm-input-login"
          label="E-mail"
          placeholder=" "
          onChange={e => setEmail(e.target.value)}
          value={email}
        />
        <InputBase
          data-testid="loginForm-input-password"
          label="Senha"
          placeholder=" "
          icon={!showPassword ? 'eye-off' : 'eye'}
          onChange={e => setPassword(e.target.value)}
          value={password}
          type={!showPassword ? 'password' : ''}
          onActionIconClick={HandlerClick}
        />
        {showAlert && (
          <Alert
            data-testid="alert-login-incorret"
            variant="error"
            width={312}
            text="Os dados que você informou não estão corretos. Confira e tente novamente."
          />
        )}
        <div className={styles['forgot_passowrd_redirect']}>
          <LinkButton label="Esqueceu sua senha?" />
        </div>
        <div>
          <Button
            disabled={isSubmitting}
            data-testid="loginForm-buttom-login"
            onClick={() => handleSubmit(email, password)}
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

export default LoginForm;

import { Button } from "junto-design-system";
import { useHistory } from 'react-router-dom';
import styles from './RequestResetPasswordInvalid.module.scss';
import { ReactComponent as LogoVendors } from '../../assets/logoVendors.svg';


function RequestResetPasswordInvalid() {
  const history = useHistory();

  const handleGoPageLogin = () => {
    history.push('/request-forgot-password');
  };

  return (
    <div className={styles['reset_password_container__wrapper']}>
      <LogoVendors/>
      <div className={styles['reset_password_box']}>
        <div className={styles['reset_password_container__title']}><span>Ops! Parece que tivemos um problema.</span></div>
        <div className={styles['reset_password_container__information']}><span>Infelizmente este link expirou. Precisamos que você solicite um novo link para criar seu acesso ou redefinir sua senha. Em caso de dúvidas, entre em contato pelo e-mail <a href="">vendors@juntoseguros.com</a></span></div>
        <div className={styles['reset_password_redirect']}>
              <Button
              data-testid="loginForm-buttom-login"
              onClick={() => handleGoPageLogin()}
              type="submit" fullWidth>
              Solicitar novo link
              </Button>
        </div>
    </div>
 </div>
  );
}

export default RequestResetPasswordInvalid;

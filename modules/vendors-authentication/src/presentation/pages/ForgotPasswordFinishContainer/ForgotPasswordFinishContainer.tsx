import { LinkButton } from "junto-design-system";
import { useHistory } from 'react-router-dom';
import styles from './ForgotPasswordFinishContainer.module.scss';
import { ReactComponent as LogoVendors } from '../../assets/logoVendors.svg';
import { ReactComponent as IconFinish } from '../../assets/iconFinish-vendors-blue.svg';

function FirstAccessFinishContainer() {
  const history = useHistory();

  const handleGoPageLogin = () => {
    history.push('/');
  };

  return (
    <div className={styles['forgot_password_finish_container__wrapper']}>
      <LogoVendors/>
      <div className={styles['forgot_password_finish_box']}>
        <div className={styles['forgot_password_finish__illustration']}>
        <IconFinish/>
        </div>
        <div className={styles['forgot_password_finish_container__information']}><span>Senha alterada com sucesso.</span></div>
        <div className={styles['forgot_passowrd_redirect']}>
            <LinkButton label="Voltar ao login" onClick={() => handleGoPageLogin()}/>
        </div>
    </div>
 </div>
  );
}

export default FirstAccessFinishContainer;

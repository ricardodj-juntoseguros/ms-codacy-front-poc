import { LinkButton } from 'junto-design-system';
import { useNavigate } from 'react-router-dom';
import styles from './RequestForgotPasswordFinishContainer.module.scss';
import { ReactComponent as LogoVendors } from '../../assets/logoVendors.svg';
import { ReactComponent as IconFinish } from '../../assets/iconFinish-vendors-blue.svg';

function RequestForgotPasswordFinishContainer() {
  const navigate = useNavigate();

  const handleGoPageLogin = () => {
    navigate('/');
  };

  return (
    <div className={styles['request_forgot_password_finish_container_wrapper']}>
      <LogoVendors />
      <div className={styles['request_forgot_password_finish_box']}>
        <div className={styles['request_forgot_password_finish_illustration']}>
          <IconFinish />
        </div>
        <div
          className={
            styles['request_forgot_password_finish_container_information']
          }
        >
          <span>
            Pronto! Se o e-mail informado estiver cadastrado, você receberá
            instruções para recuperar seu acesso.
          </span>
        </div>
        <div className={styles['request_forgot_password_redirect']}>
          <LinkButton
            label="Voltar ao login"
            onClick={() => handleGoPageLogin()}
          />
        </div>
      </div>
    </div>
  );
}

export default RequestForgotPasswordFinishContainer;

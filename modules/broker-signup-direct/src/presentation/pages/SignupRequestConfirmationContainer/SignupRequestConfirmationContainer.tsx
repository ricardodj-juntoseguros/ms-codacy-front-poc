import styles from './SignupRequestConfirmationContainer.module.scss';
import { ReactComponent as FinishIcon } from '../../assets/finishIcon.svg';
import { ReactComponent as LogoJunto } from '../../assets/logoJunto.svg';

const SignupRequestConfirmationContainer = () => {
  return (
    <div className={styles['signup-request-confirmation-container__wrapper']}>
      <div className={styles['signup-request-confirmation-container__header']}>
        <LogoJunto />
      </div>
      <div className={styles['signup-request-confirmation__signup-box']}>
        <FinishIcon />
        <div className={styles['signup-request-confirmation-container__title']}>
          <span>Cadastro solicitado!</span>
        </div>
        <div
          className={
            styles['signup-request-confirmation-container__information']
          }
        >
          <span>
            Fique de olho, entraremos em contato com você. As instruções para
            criação do seu acesso serão enviadas por e-mail.
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignupRequestConfirmationContainer;

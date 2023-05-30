import styles from './LoginContainer.module.scss';
import { ReactComponent as LogoVendors } from '../../assets/logoVendors.svg';
import { LoginForm } from '../../components/LoginForm'


function LoginContainer() {

  return (
    <div className={styles['login_container__wrapper']}>
        <LogoVendors />
        <LoginForm/>
   </div>
  );
}

export default LoginContainer;

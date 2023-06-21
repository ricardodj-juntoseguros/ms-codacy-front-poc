import { useParams } from "react-router-dom";
import styles from './ForgotPasswordContainer.module.scss';
import { ReactComponent as LogoVendors } from '../../assets/logoVendors.svg';
import { FirstAccessForm } from '../../components/FirstAccessForm'


function ForgotPasswordContainer() {
  const { hash,token } = useParams() as any;
  const hashValue = hash?.replace('hash=', '')
  const tokenValue = token?.replace('token=', '')


  return (
    <div className={styles['forgot_password_wrapper']}>
        <div className={styles['forgot_password_logo']}>
          <LogoVendors />
        </div>
        <FirstAccessForm hash={hashValue} token={tokenValue} title="Crie uma nova senha." isFiristAccess={false} labelButton='Salvar Senha'/>
   </div>
  );
}

export default ForgotPasswordContainer;

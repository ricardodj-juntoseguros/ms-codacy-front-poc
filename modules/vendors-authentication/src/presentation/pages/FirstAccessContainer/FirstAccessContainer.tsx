import { useParams } from "react-router-dom";
import styles from './FirstAccessContainer.module.scss';
import { ReactComponent as LogoVendors } from '../../assets/logoVendors.svg';
import { FirstAccessForm } from '../../components/FirstAccessForm'


function FirstAccessContainer() {
  const { hash,token } = useParams() as any;
  const hashValue = hash?.replace('hash=', '')
  const tokenValue = token?.replace('token=', '')


  return (
    <div className={styles['first_Access__wrapper']}>
        <div className={styles['first_Access__logo']}>
          <LogoVendors />
        </div>
        <FirstAccessForm hash={hashValue} token={tokenValue}/>
   </div>
  );
}

export default FirstAccessContainer;

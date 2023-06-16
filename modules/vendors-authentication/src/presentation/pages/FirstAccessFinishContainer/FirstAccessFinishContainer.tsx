import { useEffect} from 'react';
import { VendorsAuthService } from '@services';
import styles from './FirstAccessFinishContainer.module.scss';
import { ReactComponent as LogoVendors } from '../../assets/logoVendors-white.svg';
import { ReactComponent as IconFinish } from '../../assets/iconFinish-vendors.svg';

function FirstAccessFinishContainer() {


  useEffect(() => {
    setTimeout(() => {
      VendorsAuthService.redirectLogin();
    }, 3000);
  }, []);

  return (
    <div className={styles['first_Access_finish_container__wrapper']}>
      <LogoVendors/>
      <div className={styles['first_Access_finish_box']}>
        <div className={styles['first_Access_finish__illustration']}>
        <IconFinish/>
        </div>
        <div className={styles['first_Access_finish_container__information']}><span>Senha criada com sucesso. <br/> A partir de agora você poderá visualizar todas as oportunidades Vendors.</span></div>
    </div>

 </div>
  );
}

export default FirstAccessFinishContainer;

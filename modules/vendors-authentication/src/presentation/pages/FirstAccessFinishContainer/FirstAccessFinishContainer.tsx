import { useEffect } from 'react';
import { useParams } from "react-router-dom";
import { VendorsAuthService } from '@services';
import styles from './FirstAccessFinishContainer.module.scss';
import { ReactComponent as LogoVendors } from '../../assets/logoVendors-white.svg';
import { ReactComponent as IconFinish } from '../../assets/iconFinish-vendors.svg';

function FirstAccessFinishContainer() {
  const {proposalId,guid} = useParams() as any;
  let redirectUrl = '/';

  useEffect(() => {
    if(proposalId && guid){
      redirectUrl= `${process.env.NX_GLOBAL_VENDORS_PLATFORM_URL}/pre-approval&t010_id=${proposalId}&guid=${guid}`
      setTimeout(() => {
        window.location.assign(redirectUrl);
      }, 3000);
    }
    else{
      redirectUrl = VendorsAuthService.getRedirectPageAfterLogin();
      setTimeout(() => {
        window.location.assign(redirectUrl);
      }, 3000);
    }
  }, []);

  return (
    <div className={styles['first_Access_finish_container__wrapper']}>
      <LogoVendors />
      <div className={styles['first_Access_finish_box']}>
        <div className={styles['first_Access_finish__illustration']}>
          <IconFinish />
        </div>
        <div className={styles['first_Access_finish_container__information']}>
          <span data-testid="finish_first_access-span">
            Senha criada com sucesso. <br /> A partir de agora você poderá
            visualizar todas as oportunidades Vendors.
          </span>
        </div>
      </div>
    </div>
  );
}

export default FirstAccessFinishContainer;

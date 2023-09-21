import { RouteComponentProps } from 'react-router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import styles from './FinishSignupContainer.module.scss';
import { HeaderPages } from '../../components/HeaderPages/HeaderPages'
import { ReactComponent as IconFinish } from '../../assets/iconFinish.svg';
import { selectBroker } from '../../../application/features/brokerInformation/BrokerInformationSlice';

const FinishSignupContainer= ({ history }: RouteComponentProps) => {
  const brokerInformation = useSelector(selectBroker);

  useEffect(() => {
    if(brokerInformation.information.federalId === ''){
      history.push('/');
    }
    },[brokerInformation.information.federalId, history]);

  const handleGoBackClick = () => {
    history.push('/');
  };

  return (
    <div className={styles['finish_signup_container__wrapper']}>
       <HeaderPages handleGoBackClick={handleGoBackClick} showLinkButton={false}/>
       <div className={styles['finish_signup_box']}>
          <div className={styles['finish_signup__illustration']}>
          <IconFinish/>
          </div>
          <div className={styles['finish_signup_container__title']}><span>Cadastro solicitado! Fique de olho, entraremos em contato com você.</span></div>
          <div className={styles['finish_signup_container__information']}><span>Você receberá um e-mail para dar sequência na criação do seu acesso.</span></div>
      </div>
    </div>
  );
}

export default FinishSignupContainer;

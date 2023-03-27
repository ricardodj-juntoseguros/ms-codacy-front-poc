import { RouteComponentProps } from 'react-router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import styles from './BrokerUploadDocumentsContainer.module.scss';
import UploadDocuments from '../../components/UploadDocuments';
import { HeaderPages } from '../../components/HeaderPages/HeaderPages'
import { selectBroker } from '../../../application/features/brokerInformation/BrokerInformationSlice';

const BrokerUploadDocumentsContainer= ({ history }: RouteComponentProps) => {
  const brokerInformation = useSelector(selectBroker);

  useEffect(() => {
    if(brokerInformation.information.federalId === ''){
      history.push('/');
    }
    },[brokerInformation.information.federalId, history]);

  const handleGoBackClick = () => {
    history.push('/broker-details');
  };

  const onSubmit = () => {
    history.push('/finish-signup');;
  };


  return (
    <div className={styles['broker_upload_documents_container__wrapper']}>
       <HeaderPages showLinkButton handleGoBackClick={handleGoBackClick}/>
      <div className={styles['broker_upload_documents_container__title']}><span>Por último, precisamos de alguns documentos da corretora</span></div>
      <UploadDocuments  handleGoNextClick={onSubmit}/>
    </div>
  );
}

export default BrokerUploadDocumentsContainer;

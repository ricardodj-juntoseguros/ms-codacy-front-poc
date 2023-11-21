import { RouteComponentProps } from 'react-router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import styles from './BrokerUploadDocumentsContainer.module.scss';
import UploadDocuments from '../../components/UploadDocuments';
import { selectBroker } from '../../../application/features/brokerInformation/BrokerInformationSlice';
import LogoJuntoSeguros from '../../components/LogoJunto/LogoJuntoSeguros';

const BrokerUploadDocumentsContainer = ({ history }: RouteComponentProps) => {
  const brokerInformation = useSelector(selectBroker);

  // useEffect(() => {
  //   if(brokerInformation.information.federalId === ''){
  //     history.push('/');
  //   }
  //   },[brokerInformation.information.federalId, history]);

  const onSubmit = () => {
    history.push('/finish');
  };

  return (
    <>
      <div className={styles['broker-upload-documents-container__wrapper']}>
        <LogoJuntoSeguros />
        <UploadDocuments handleGoNextClick={onSubmit} />
      </div>
    </>
  );
};

export default BrokerUploadDocumentsContainer;

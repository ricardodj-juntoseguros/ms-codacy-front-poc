import { RouteComponentProps } from 'react-router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'junto-design-system';
import styles from './BrokerInitialUploadDocumentsContainer.module.scss';
import { selectBroker } from '../../../application/features/brokerInformation/BrokerInformationSlice';
import LogoJuntoSeguros from '../../components/LogoJunto/LogoJuntoSeguros';
import { ReactComponent as ProofAddressIllustration } from '../../assets/addressProof.svg';
import { ReactComponent as SocialContractIllustration } from '../../assets/socialContract.svg';
import { ReactComponent as BankProofIllustration } from '../../assets/bankProof.svg';

const BrokerInitialUploadDocumentsContainer = ({
  history,
}: RouteComponentProps) => {
  const brokerInformation = useSelector(selectBroker);

  // useEffect(() => {
  //   if (brokerInformation.information.federalId === '') {
  //     history.push('/');
  //   }
  // }, [brokerInformation.information.federalId, history]);

  const handleGoToUploadDocumentsPage = () => {
    history.push('/upload-documents');
  };

  return (
    <>
      <div
        className={styles['broker-initial-upload-documents-container__wrapper']}
      >
        <LogoJuntoSeguros />
        <div className={styles['broker-initial-upload-documents__title']}>
          <h1>Quase lá!</h1>
          <p>Por último precisamos de alguns documentos.</p>
        </div>
        <div
          className={
            styles['broker-initial-upload-documents__illustration-container']
          }
        >
          <div
            className={styles['broker-initial-upload-documents__illustration']}
          >
            <ProofAddressIllustration />
            <span>Comprovante de endereço</span>
          </div>
          <div
            className={styles['broker-initial-upload-documents__illustration']}
          >
            <BankProofIllustration />
            <span>Comprovante bancário</span>
          </div>
          <div
            className={styles['broker-initial-upload-documents__illustration']}
          >
            <SocialContractIllustration />
            <span>Contrato Social</span>
          </div>
        </div>
        <div className={styles['broker-initial-upload-documents__button']}>
          <Button
            data-testid="button-broker-go-to-upload"
            onClick={handleGoToUploadDocumentsPage}
          >
            Continuar
          </Button>
        </div>
      </div>
    </>
  );
};

export default BrokerInitialUploadDocumentsContainer;

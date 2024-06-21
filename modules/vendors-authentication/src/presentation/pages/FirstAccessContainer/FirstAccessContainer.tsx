import { useParams } from 'react-router-dom';
import styles from './FirstAccessContainer.module.scss';
import { ReactComponent as LogoVendors } from '../../assets/logoVendors.svg';
import FirstAccessForm from '../../components/FirstAccessForm';

function FirstAccessContainer() {
  const { hash } = useParams() as any;

  const hashValue = hash?.split('&')[0]?.replace('hash=', '');
  const token = hash?.split('&')[1]?.replace('token=', '');
  const proposalId = hash?.split('&')[2]?.replace('documentId=', '');
  const guid = hash?.split('&')[3]?.replace('guid=', '');

  return (
    <div className={styles['first_Access__wrapper']}>
      <div className={styles['first_Access__logo']}>
        <LogoVendors />
      </div>
      <FirstAccessForm
        hash={hashValue}
        token={token}
        proposalId={proposalId}
        guid={guid}
        title="Para sua segurança, precisamos que você defina uma senha."
        isFiristAccess
      />
    </div>
  );
}

export default FirstAccessContainer;

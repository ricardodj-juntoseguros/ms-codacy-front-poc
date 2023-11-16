import { RouteComponentProps } from 'react-router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import styles from './CreateUserAccessContainer.module.scss';
import CreateUserForm from '../../components/CreateUserForm/CreateUserForm';
import LogoJuntoSeguros from '../../components/LogoJunto/LogoJuntoSeguros';
import { selectBroker } from '../../../application/features/brokerInformation/BrokerInformationSlice';

const CreateUserAccessContainer = ({ history }: RouteComponentProps) => {
  const sreenWidth = window.screen.width;
  const brokerInformation = useSelector(selectBroker);

  useEffect(() => {
    if (brokerInformation.information.federalId === '') {
      history.push('/');
    }
  }, [brokerInformation.information.federalId, history]);

  const handleGoNextClick = () => {
    history.push('/finish');
  };

  return (
    <div className={styles['create-user-access_container__wrapper']}>
      <LogoJuntoSeguros />
      <div className={styles['create-user-access_container__section']}>
        <div className={styles['create-user-access_container_form']}>
          <h1>Agora vamos criar seu acesso</h1>
          <h2>
            Você vai acessar a plataforma da Junto com esse usuário e senha.
          </h2>
        </div>
        <CreateUserForm handleGoNextClick={handleGoNextClick} />
      </div>
      <div className={styles['create-user-access_container_illustration']}>
        <img
          src={
            sreenWidth < 1680
              ? 'https://static.juntoseguros.com/images/create-user-img-600.jpg'
              : 'https://static.juntoseguros.com/images/create-user-img-736.jpg'
          }
          data-testid="logo-Junto"
          alt="Logo - Junto"
        />
      </div>
    </div>
  );
};

export default CreateUserAccessContainer;

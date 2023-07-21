import { RouteComponentProps } from 'react-router';
import { useSelector } from 'react-redux';
import { LinkButton } from 'junto-design-system';
import styles from './SearchRegistrationContainer.module.scss';
import { ReactComponent as LogoJunto } from '../../assets/logoJunto.svg';
import SearchBrokerFederalId from '../../components/SearchBrokerFederalId/SearchBrokerFederalId';

const SearchRegistrationContainer = ({ history }: RouteComponentProps) => {
  const sreenHeight = window.screen.height;

  const handleGoNextClick = () => {
      history.push('/register-responsible');
  };

  const handleBackButtonClick = () => {
    const brokerProcessesUrl = process.env.NX_GLOBAL_LOGIN_NOVOS_CLIENTES || '';
    window.location.assign(brokerProcessesUrl);
  };

  return (
    <div className={styles['search_registration_container__wrapper']}>
      <div className={styles['search_registration_container__section']}>
        <div className={styles['search_registration_container__illustration']}><LogoJunto />
            <h1>Cadastre sua corretora</h1>
            <h2>Crie uma conta e contrate em minutos as garantias para seus clientes.</h2>
        </div>
            <SearchBrokerFederalId handleGoNextClick={handleGoNextClick}/>
            <div className={styles['search_registration_container__helper']}>
              <p>Você não é corretor?</p>
              <LinkButton onClick={() => handleBackButtonClick()} label="Acesse sua plataforma" icon="arrow-right" iconPosition="right"/>
            </div>
      </div>
        <img
                src={sreenHeight < 800 ? "https://static.juntoseguros.com/images/HomeSignupx09.png" :  "https://static.juntoseguros.com/images/HomeSignupx1.png"  }
                data-testid="logo-Junto"
                alt="Logo - Junto"
        />
    </div>


  );
}

export default SearchRegistrationContainer;

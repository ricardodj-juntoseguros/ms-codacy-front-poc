import { LinkButton } from 'junto-design-system';
import { BrokerPlatformAuthService } from '@services';
import UserMenu from '../UserMenu';
import { ReactComponent as LogoFidelize } from './assets/logo-fidelize.svg';
import styles from './Header.module.scss';

const Header: React.FC = () => {
  const handleBackButtonClick = () => {
    const brokerProcessesUrl = process.env.NX_GLOBAL_BROKER_PROCESSES_URL || '';
    window.location.assign(brokerProcessesUrl);
  };

  if (!BrokerPlatformAuthService.isAuthenticated()) return null;
  return (
    <header className={styles.header__wrapper}>
      <div className={styles['header__back-button-wrapper']}>
        <LinkButton
          data-testid="header-back-btn"
          label="Ir para a lista de processos"
          icon="arrow-left"
          onClick={() => handleBackButtonClick()}
        />
      </div>
      <div className={styles['header__logo-wrapper']}>
        <LogoFidelize />
      </div>
      <div className={styles['header__user-menu-wrapper']}>
        <UserMenu />
      </div>
    </header>
  );
};

export default Header;

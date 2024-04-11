import { LinkButton } from 'junto-design-system';
import { BrokerPlatformAuthService } from '@services';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import UserMenu from '../UserMenu';
import { ReactComponent as LogoFidelize } from './assets/logo-fidelize.svg';
import styles from './Header.module.scss';

const Header: React.FC = () => {
  const [canRequestOpportunity, setCanRequestOpportunity] = useState(false);
  useEffect(() => {
    const fidelizeBrokersFeaturesCookie = Cookies.get(
      process.env.NX_GLOBAL_FIDELIZE_BROKER_FEATURES_COOKIE || 'fbfc',
    );
    if (!fidelizeBrokersFeaturesCookie) {
      setCanRequestOpportunity(false);
    } else {
      const { features } = JSON.parse(fidelizeBrokersFeaturesCookie);
      setCanRequestOpportunity(features.includes('FIDELIZE_SOLICITACAO'));
    }
  }, []);

  const handleBackButtonClick = () => {
    const brokerProcessesUrl = process.env.NX_GLOBAL_BROKER_PROCESSES_URL || '';
    window.location.assign(brokerProcessesUrl);
  };

  const handleSwitchModule = (path: string) => {
    window.location.assign(path);
  };

  if (!BrokerPlatformAuthService.isAuthenticated()) return null;

  return (
    <header className={styles.header__wrapper}>
      <div className={styles['header__back-button-wrapper']}>
        <LinkButton
          data-testid="header-back-btn"
          label="Ir para a home"
          icon="arrow-left"
          onClick={() => handleBackButtonClick()}
        />
      </div>
      <div className={styles['header__logo-wrapper']}>
        <LogoFidelize />
      </div>
      {canRequestOpportunity && (
        <div className={styles['header__links-wrapper']}>
          <LinkButton
            data-testid="header-back-btn"
            label="Meu dashboard"
            size="large"
            onClick={() => handleSwitchModule('/dashboard')}
          />
          <LinkButton
            data-testid="header-back-btn"
            label="Nova solicitação"
            size="large"
            onClick={() => handleSwitchModule('/solicitar')}
          />
        </div>
      )}
      <div className={styles['header__user-menu-wrapper']}>
        <UserMenu />
      </div>
    </header>
  );
};

export default Header;

import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LinkButton, ThemeContext } from 'junto-design-system';
import { nanoid } from 'nanoid/non-secure';
import className from 'classnames';
import { VendorsAuthService } from '@services';
import { ReactComponent as LogoMarsh } from './assets/logo-marsh.svg';
import VendorsUserMenu from './VendorsUserMenu';
import styles from './VendorsHeader.module.scss';

const MENU_ITEMS = {
  insured: [
    {
      label: 'Meu painel',
      redirect: '/policies',
    },
    {
      label: 'Solicitar garantia',
      redirect: '/proposal',
    },
  ],
  policyholder: [],
  broker: [],
};

export interface VendorsHeaderProps {
  showMenuItems?: boolean;
  backButton?: () => void;
}

export const VendorsHeader: React.FC<VendorsHeaderProps> = ({
  showMenuItems = true,
  backButton,
}) => {
  const theme = useContext(ThemeContext);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    });

    return () => {
      window.removeEventListener('resize', () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      });
    };
  }, []);

  const menuItems = (): { label: string; redirect: string }[] => {
    const userData = VendorsAuthService.getUserAccessCookie();
    if (!userData || !userData.userType) return [];
    const { userType } = userData;
    return MENU_ITEMS[userType as 'insured' | 'broker' | 'policyholder'];
  };

  const renderNavMenu = () => {
    return (
      <ul className={styles['vendors-header__list']}>
        {menuItems().map(item => (
          <li className={styles['vendors-header__item']} key={nanoid(5)}>
            <Link
              data-testid={`header-anchor-${item.redirect}`}
              className={className(
                styles['vendors-header__link'],
                styles[theme],
              )}
              to={item.redirect}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  const renderBackButton = () => {
    if (!backButton) {
      return (
        <Link
          data-testid="header-logo-back"
          to="/"
          className={styles['vendors-header__logo']}
        >
          <LogoMarsh className={styles['vendors-header__img']} />
        </Link>
      );
    }

    return (
      <LinkButton
        data-testid="header-button-back"
        label={windowSize.width > 576 ? 'Voltar' : ''}
        onClick={backButton}
        icon="arrow-left"
      />
    );
  };

  return (
    <header className={styles['vendors-header']}>
      {renderBackButton()}

      <nav className={styles['vendors-header__navbar']}>
        {showMenuItems && renderNavMenu()}
        <VendorsUserMenu
          isMobile={windowSize.width <= 576}
          username={VendorsAuthService.getUsername() || ''}
          userEmail={VendorsAuthService.getUserEmail() || ''}
        />
      </nav>
    </header>
  );
};

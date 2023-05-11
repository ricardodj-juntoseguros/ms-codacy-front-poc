import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LinkButton, ThemeContext } from 'junto-design-system';
import { nanoid } from 'nanoid/non-secure';
import className from 'classnames';
import LogoMarsh from '../../../assets/logo-marsh.svg';
import UserMenu from '../UserMenu/UserMenu';
import { MENU_ITEMS, USER_MENU_ITEMS } from '../../../constants';

import styles from './Header.module.scss';

export interface HeaderProps {
  showMenuItems?: boolean;
  backButton?: () => void;
}

const Header: React.FC<HeaderProps> = ({ showMenuItems = true, backButton }) => {
  const theme = useContext(ThemeContext);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    });

    return () => {
      window.removeEventListener("resize", () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      });
    };
  }, []);

  const renderNavMenu = () => {
    return (
      <ul className={styles['header__list']}>
        {MENU_ITEMS.map(item => (
          <li className={styles['header__item']} key={nanoid(5)}>
            <Link data-testid={`header-anchor-${item.redirect}`} className={className(
              styles['header__link'],
              styles[theme]
            )} to={item.redirect}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  const renderBackButton = () => {
    if (!backButton) {
      return (
        <Link data-testid="header-logo-back" to='/' className={styles['header__logo']}>
          <img src={LogoMarsh} className={styles['header__img']} alt="Logo da plataforma Marsh vendors" />
        </Link>
      );
    }

    return (
      <LinkButton
        data-testid="header-button-back"
        label={windowSize.width > 576 ? 'Voltar' : ''}
        onClick={backButton}
        icon='arrow-left'
      />
    )
  }

  return (
    <header className={styles.header}>
      {renderBackButton()}

      <nav className={styles['header__navbar']}>
        {showMenuItems && renderNavMenu()}
        <UserMenu
          isMobile={windowSize.width <= 576}
          username='Ana Paula Antunes'
          userEmail='ana_antunes@marsh.com'
          userMenuItems={USER_MENU_ITEMS}
        />
      </nav>
    </header>
  );
};

export default Header;

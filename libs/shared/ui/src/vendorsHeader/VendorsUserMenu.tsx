import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { VendorsAuthService } from '@services';
import { ChatUtils } from '@shared/utils';
import { Link } from 'react-router-dom';
import { nanoid } from 'nanoid/non-secure';
import className from 'classnames';
import { Divider, ThemeContext } from 'junto-design-system';
import styles from './VendorsUserMenu.module.scss';

const USER_MENU_ITEMS = {
  insured: [],
  policyholder: [],
  broker: [],
};

export interface VendorsUserMenuProps {
  username: string;
  userEmail: string;
  isMobile: boolean;
}

const VendorsUserMenu: React.FC<VendorsUserMenuProps> = ({
  username,
  userEmail,
  isMobile,
}) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const initialLetter = useMemo(
    () => username && username[0].toUpperCase(),
    [username],
  );
  const theme = useContext(ThemeContext);

  useEffect(() => {
    function onBodyClick(this: HTMLElement, ev: MouseEvent) {
      if (!triggerRef.current) return;
      if (triggerRef.current.contains(ev.target as Node)) {
        return;
      }
      setUserMenuOpen(false);
    }
    document.body.addEventListener('click', onBodyClick);
    return () => {
      document.body.removeEventListener('click', onBodyClick);
    };
  }, [triggerRef]);

  const userMenuItems = (): { label: string; redirect: string }[] => {
    const userData = VendorsAuthService.getUserAccessCookie();
    if (!userData || !userData.userType) return [];
    const { userType } = userData;
    return USER_MENU_ITEMS[userType as 'insured' | 'broker' | 'policyholder'];
  };

  const renderUserInfo = () => {
    return (
      <>
        <div className="nav__info">
          <p className={className(styles['nav__name'], styles[theme])}>
            {username}
          </p>
          <p className={className(styles['nav__email'], styles[theme])}>
            {userEmail}
          </p>
        </div>
      </>
    );
  };

  const renderUserMenuItems = () => {
    return userMenuItems().map(item => (
      <li
        className={className(styles['nav__item'], styles[theme])}
        key={nanoid(5)}
      >
        <Link
          data-testid={`userMenu-link-${item.redirect}`}
          className={className(styles['nav__link'], styles[theme])}
          to={item.redirect}
        >
          {item.label}
        </Link>
      </li>
    ));
  };

  return (
    <div className={styles['vendors-usermenu']} ref={triggerRef}>
      <button
        data-testid="userMenu-button-open-menu"
        type="button"
        className={styles['vendors-usermenu__button']}
        onClick={() => setUserMenuOpen(!userMenuOpen)}
      >
        {!isMobile && (
          <p
            className={className(
              styles['vendors-usermenu__name'],
              styles[theme],
            )}
          >
            {username}
          </p>
        )}

        <figure
          className={className(
            styles['vendors-usermenu__avatar'],
            styles[theme],
          )}
        >
          {initialLetter}
        </figure>
      </button>
      <nav
        className={className(
          styles['vendors-usermenu__nav'],
          styles['nav'],
          {
            [styles['vendors-usermenu__nav--open']]: userMenuOpen,
          },
          styles[theme],
        )}
      >
        {renderUserInfo()}
        <ul className={styles['nav__list']}>
          <Divider />
          {renderUserMenuItems()}
          <Divider />
          <li className={styles['nav__item']} key={nanoid(5)}>
            <button
              data-testid="userMenu-button-logout"
              type="button"
              className={className(styles['nav__link'], styles[theme])}
              onClick={() => VendorsAuthService.logout()}
            >
              Sair da plataforma
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default VendorsUserMenu;

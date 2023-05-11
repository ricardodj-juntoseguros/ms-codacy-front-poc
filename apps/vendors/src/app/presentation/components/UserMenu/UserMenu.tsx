import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { nanoid } from 'nanoid/non-secure';
import className from 'classnames';
import { Divider, ThemeContext } from 'junto-design-system';

import styles from './UserMenu.module.scss';

export interface UserMenuProps {
  username: string;
  userEmail: string;
  userMenuItems: {
    label: string;
    redirect: string;
  }[];
  isMobile: boolean;
}

const UserMenu: React.FC<UserMenuProps> = ({ username, userEmail, userMenuItems, isMobile }) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const initialLetter = useMemo(() => username && username[0].toUpperCase(), [username]);
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

  const renderUserInfo = () => {
    return (
      <>
        <div className='nav__info'>
          <p className={className(
            styles['nav__name'],
            styles[theme]
          )}>
            {username}
          </p>
          <p className={className(
            styles['nav__email'],
            styles[theme]
          )}>{userEmail}</p>
        </div>
      </>
    )
  };

  const renderUserMenuItems = () => {
    return userMenuItems.map((item) => (
      <li className={className(
        styles['nav__item'],
        styles[theme]
      )} key={nanoid(5)}>
        <Link
          data-testid={`userMenu-link-${item.redirect}`}
          className={className(
            styles['nav__link'],
            styles[theme]
          )}
          to={item.redirect} >
          {item.label}
        </Link>
      </li>
    ))
  };

  return (
  <div className={styles['usermenu']} ref={triggerRef}>
    <button
      data-testid="userMenu-button-open-menu"
      type="button"
      className={styles['usermenu__button']}
      onClick={() => setUserMenuOpen(!userMenuOpen)}
    >
      {!isMobile && (
        <p className={className(
          styles['usermenu__name'],
          styles[theme]
        )}>
          {username}
        </p>
      )}

      <figure className={className(
        styles['usermenu__avatar'],
        styles[theme]
      )}>
        {initialLetter}
      </figure>
    </button>
    <nav className={className(
        styles['usermenu__nav'],
        styles['nav'],
        {
          [styles['usermenu__nav--open']]: userMenuOpen,
        },
        styles[theme]
        )}>
      {renderUserInfo()}
      <ul className={styles['nav__list']}>
        <Divider />
        {renderUserMenuItems()}
        <Divider />
        <li className={styles['nav__item']} key={nanoid(5)}>
          <button
            data-testid="userMenu-button-logout"
            type="button"
            className={className(
              styles['nav__link'],
              styles[theme]
            )}
            onClick={() => window.alert('logout')}
          >
            Sair da plataforma
          </button>
        </li>
      </ul>
    </nav>
  </div>
  );
};

export default UserMenu;

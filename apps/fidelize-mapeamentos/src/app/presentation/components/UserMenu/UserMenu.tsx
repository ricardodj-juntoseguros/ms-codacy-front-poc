/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState, useMemo } from 'react';
import classNames from 'classnames';
import { BackofficeAuthService } from '@services';
import styles from './UserMenu.module.scss';
import { ReactComponent as LogoutIcon } from './assets/logout-icon.svg';

const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const userName = useMemo(() => {
    return BackofficeAuthService.getUserName();
  }, []);

  const handleLogout = () => {
    BackofficeAuthService.clearAuthData();
    window.location.assign(
      `${process.env.NX_GLOBAL_BACKOFFICE_PLATFORM_URL}/logout`,
    );
  };

  return (
    <div
      data-testid="user-menu"
      role="button"
      tabIndex={0}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className={styles['user-menu__info']} data-testid="user-info">
        <p className={styles['user-menu__info-name']}>Olá, {userName || ''}</p>
      </div>
      <div className={styles['user-menu__avatar']}>
        <p data-testid="user-initial">
          {userName !== null ? userName.substring(0, 1).toUpperCase() : ''}
        </p>
      </div>
      <div
        className={classNames(styles['user-menu__floating-menu'], {
          [styles['user-menu__floating-menu--open']]: isOpen,
        })}
      >
        <button
          data-testid="logout-btn"
          type="button"
          className={styles['user-menu__floating-menu-item']}
          onClick={() => handleLogout()}
        >
          <LogoutIcon />
          <p>Sair</p>
        </button>
      </div>
    </div>
  );
};

export default UserMenu;

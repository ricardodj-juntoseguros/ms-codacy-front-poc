import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { BrokerPlatformAuthService } from '@services';
import Cookies from 'js-cookie';
import styles from './UserMenu.module.scss';

const UserMenu: React.FC = () => {
  const [canRequestOpportunity, setCanRequestOpportunity] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [navOpen, setNavOpen] = useState(false);
  const username = BrokerPlatformAuthService.getUsername();

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

  useEffect(() => {
    function onBodyClick(this: HTMLElement, ev: MouseEvent) {
      if (!triggerRef.current) return;
      if (triggerRef.current.contains(ev.target as Node)) {
        return;
      }
      setNavOpen(false);
    }
    document.body.addEventListener('click', onBodyClick);
    return () => {
      document.body.removeEventListener('click', onBodyClick);
    };
  }, [triggerRef]);

  const handleNavigation = (url: string) => {
    window.location.assign(url);
  };

  const renderAvatar = () => {
    return (
      <figure
        data-testid="user-menu-avatar"
        className={styles['user-menu__avatar']}
      >
        {username && username[0].toUpperCase()}
      </figure>
    );
  };

  const renderProfile = () => {
    return (
      <div className={styles['user-menu__profile']}>
        <div className={styles['user-menu__profile-data']}>
          <p className={styles['user-menu__profile-name']}>{username}</p>
        </div>
        {renderAvatar()}
      </div>
    );
  };

  return (
    <div ref={triggerRef}>
      <button
        type="button"
        data-testid="user-menu-trigger"
        className={styles['user-menu__trigger-button']}
        onClick={() => setNavOpen(!navOpen)}
      >
        {renderAvatar()}
      </button>
      <nav
        data-testid="user-menu-nav"
        className={classNames(styles['user-menu__nav'], {
          [styles['user-menu__nav--open']]: navOpen,
        })}
      >
        <ul className={styles['user-menu__nav-list']}>
          <li className={styles['user-menu__nav-list-item']}>
            {renderProfile()}
          </li>
          {canRequestOpportunity && (
            <>
              <li className={styles['user-menu__nav-list-item']}>
                <button
                  type="button"
                  data-testid="user-menu-goto-dashboard-button"
                  className={styles['user-menu__nav-button']}
                  onClick={() => handleNavigation('/dashboard')}
                >
                  Meu dashboard
                </button>
              </li>
              <li className={styles['user-menu__nav-list-item']}>
                <button
                  type="button"
                  data-testid="user-menu-goto-solicitar-button"
                  className={styles['user-menu__nav-button']}
                  onClick={() => handleNavigation('/solicitar')}
                >
                  Nova solicitação
                </button>
              </li>
            </>
          )}
          <li className={styles['user-menu__nav-list-item']}>
            <button
              type="button"
              data-testid="user-menu-logout-button"
              className={styles['user-menu__nav-button']}
              onClick={() => BrokerPlatformAuthService.logout()}
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

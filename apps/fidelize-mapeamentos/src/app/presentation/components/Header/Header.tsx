import styles from './Header.module.scss';
import { ReactComponent as LogoBackoffice } from './assets/logo-backoffice.svg';
import UserMenu from '../UserMenu';

const Header: React.FC = () => {
  const redirectToBackoffice = () => {
    window.location.assign(`${process.env.NX_GLOBAL_BACKOFFICE_PLATFORM_URL}`);
  };

  return (
    <header className={styles.header__wrapper}>
      <div>
        <button
          data-testid="logo"
          type="button"
          onClick={() => redirectToBackoffice()}
        >
          <LogoBackoffice />
        </button>
      </div>
      <div />
      <UserMenu />
    </header>
  );
};

export default Header;

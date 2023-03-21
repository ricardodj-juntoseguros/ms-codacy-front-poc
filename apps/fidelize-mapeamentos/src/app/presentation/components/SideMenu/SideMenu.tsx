import { useHistory } from 'react-router-dom';
import styles from './SideMenu.module.scss';
import { SIDE_MENU_ITEMS } from '../../../constants';

const SideMenu: React.FC = () => {
  const history = useHistory();

  const handleMenuItemClick = (item: { id: string }) => {
    const { id } = item;
    if (id === 'mapeamentos-fidelize') {
      history.push('/');
      window.location.reload();
      return;
    }
    window.location.assign(
      `${process.env.NX_GLOBAL_BACKOFFICE_PLATFORM_URL}/home`,
    );
  };

  return (
    <nav className={styles['side-menu__wrapper']}>
      <div className={styles['side-menu__items-wrapper']}>
        {SIDE_MENU_ITEMS.map(item => {
          const { id, icon, title } = item;
          return (
            <button
              type="button"
              className={styles['side-menu__item']}
              data-testid={`menuitem-${id}`}
              key={id}
              title={title}
              onClick={() => handleMenuItemClick(item)}
            >
              {icon}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default SideMenu;

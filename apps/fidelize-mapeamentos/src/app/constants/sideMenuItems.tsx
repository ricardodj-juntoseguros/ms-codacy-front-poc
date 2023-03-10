import { ReactComponent as GridIcon } from '../presentation/components/SideMenu/assets/grid-icon.svg';
import { ReactComponent as FidelizeIcon } from '../presentation/components/SideMenu/assets/fidelize-icon.svg';

export const SIDE_MENU_ITEMS = [
  {
    id: 'home',
    title: 'Listas de processos',
    icon: <GridIcon />,
  },
  {
    id: 'mapeamentos-fidelize',
    title: 'Painel de mapeamentos do Fidelize',
    icon: <FidelizeIcon />,
  },
];

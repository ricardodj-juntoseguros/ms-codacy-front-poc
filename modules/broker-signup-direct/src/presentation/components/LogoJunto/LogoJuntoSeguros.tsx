import { useEffect } from 'react';
import { ChatUtils } from '@shared/utils';
import styles from './LogoJuntoSeguros.module.scss';
import { ReactComponent as LogoJunto } from '../../assets/logoJunto.svg';

const LogoJuntoSeguros: React.FC = () => {
  useEffect(() => {
    ChatUtils.zenDesk.open();
  });

  return (
    <div
      className={styles['container_section_form_logo']}
      data-testid="Logo-Junto-Seguros"
    >
      <LogoJunto />
    </div>
  );
};

export default LogoJuntoSeguros;

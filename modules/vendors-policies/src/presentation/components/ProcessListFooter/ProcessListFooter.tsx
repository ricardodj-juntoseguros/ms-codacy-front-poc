import { useContext } from 'react';
import classNames from 'classnames';
import { ThemeContext } from 'junto-design-system';
import styles from './ProcessListFooter.module.scss';

const ProcessListFooter: React.FC = () => {
  const theme = useContext(ThemeContext);
  return (
    <footer
      className={classNames(
        styles[theme],
        styles['process-list-footer_wrapper'],
      )}
    >
      Desenvolvido por Junto Seguros S.A.
    </footer>
  );
};

export default ProcessListFooter;

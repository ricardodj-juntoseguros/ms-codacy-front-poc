import { useContext } from 'react';
import className from 'classnames';
import { ThemeContext } from 'junto-design-system';

import styles from './ProcessDetailsAside.module.scss';

export interface ProcessDetailsAsideProps {
  name?: string;
}

const ProcessDetailsAside: React.FC<ProcessDetailsAsideProps> = ({ name }) => {
  const theme = useContext(ThemeContext);

  return (
    <aside className={styles['process-details-aside__wrapper']}>
      <h2 className={className(
        styles['process-details-aside__title'],
        styles[theme],
        )}
      >Projeto</h2>
      <p className={className(
        styles['process-details-aside__text'],
        styles[theme],
        )}>
        Este processo está vinculado a um projeto.
      </p>

      <div
        className={className(
          styles['process-details-aside__project'],
          styles[theme],
        )}
      >
        <i className={className('icon', 'icon-clipboard', styles[theme])} />
        <p>{name}</p>
      </div>
    </aside>
  );
};

export default ProcessDetailsAside;

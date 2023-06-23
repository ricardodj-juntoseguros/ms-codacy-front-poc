import { useContext } from 'react';
import { ThemeContext } from 'junto-design-system';
import styles from './ProcessListContainer.module.scss';

function ProcessListContainer() {
  const theme = useContext(ThemeContext);

  return (
    <section className={styles['process-list-container__wrapper']}>
      <h1 className={styles[theme]}>Hello Vendors Policies</h1>
    </section>
  );
}

export default ProcessListContainer;

import { Button } from 'junto-design-system';
import styles from './Example.module.scss';

const Example = () => {
  const handleAlert = () => {
    window.alert('Plataforma | Vendors');
  }

  return (
    <section className={styles['example-container__wrapper']}>
      <h1 className={styles['example-container__title']}>Plataforma | Vendors</h1>
      <p className={styles['example-container__url']}>{process.env['NX_VENDORS_APP_URL']}</p>
      <Button onClick={() => handleAlert()}>Teste</Button>
    </section>
  );
};

export default Example;

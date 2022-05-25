import styles from './ModalityNotAvailable.module.scss';
import { ReactComponent as Illustration } from './assets/modality-not-available.svg';

const ModalityNotAvailable: React.FC = () => {
  return (
    <div className={styles['modality-not-available__wrapper']}>
      <Illustration />
      <h2 className={styles['modality-not-available__title']}>
        Modalidade indisponível
      </h2>
      <p className={styles['modality-not-available__text']}>
        Esta modalidade não está disponível no momento. Em breve você conseguirá
        acessá-la.
      </p>
    </div>
  );
};

export default ModalityNotAvailable;

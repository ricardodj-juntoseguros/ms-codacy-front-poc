import { CogsAndChartsIllustration } from '@shared/ui';
import styles from './ModalityNotAvailable.module.scss';

const ModalityNotAvailable: React.FC = () => {
  return (
    <div className={styles['modality-not-available__wrapper']}>
      <CogsAndChartsIllustration />
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

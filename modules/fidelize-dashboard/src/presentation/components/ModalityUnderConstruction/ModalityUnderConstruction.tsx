import styles from './ModalityUnderConstruction.module.scss';
import { ReactComponent as Illustration } from './assets/under-construction.svg';

const ModalityUnderConstruction: React.FC = () => {
  return (
    <div className={styles['modality-under-construction__wrapper']}>
      <Illustration />
      <h2 className={styles['modality-under-construction__title']}>
        Modalidade em construção
      </h2>
      <p className={styles['modality-under-construction__text']}>
        Estamos trabalhando no desenvolvimento dessa modalidade. Em breve
        disponibilizaremos ela para você!
      </p>
    </div>
  );
};

export default ModalityUnderConstruction;

import { UnderConstructionIllustration } from '@shared/ui';
import styles from './ModalityUnderConstruction.module.scss';

const ModalityUnderConstruction: React.FC = () => {
  return (
    <div className={styles['modality-under-construction__wrapper']}>
      <UnderConstructionIllustration />
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

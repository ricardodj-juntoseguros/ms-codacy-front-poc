import { UnderConstructionIllustration } from '@shared/ui';
import styles from './ListingUnderConstruction.module.scss';

const ListingUnderConstruction: React.FC = () => {
  return (
    <div className={styles['listing-under-construction__wrapper']}>
      <UnderConstructionIllustration />
      <h2 className={styles['listing-under-construction__title']}>
        Listagem em construção
      </h2>
      <p className={styles['listing-under-construction__text']}>
        Estamos trabalhando no desenvolvimento dessa lista. Em breve
        disponibilizaremos ela para você!
      </p>
    </div>
  );
};

export default ListingUnderConstruction;

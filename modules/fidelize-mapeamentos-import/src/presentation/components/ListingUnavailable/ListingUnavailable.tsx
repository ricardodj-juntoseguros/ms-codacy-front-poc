import { CogsAndChartsIllustration } from '@shared/ui';
import styles from './ListingUnavailable.module.scss';

const ListingUnavailable: React.FC = () => {
  return (
    <div className={styles['listing-unavailable__wrapper']}>
      <CogsAndChartsIllustration />
      <h2 className={styles['listing-unavailable__title']}>
        Lista indisponível
      </h2>
      <p className={styles['listing-unavailable__text']}>
        Esta lista não está disponível no momento. Em breve você conseguirá
        acessá-la.
      </p>
    </div>
  );
};

export default ListingUnavailable;

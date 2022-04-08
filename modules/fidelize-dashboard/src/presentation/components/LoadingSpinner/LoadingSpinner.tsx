import { Spinner } from '@shared/ui';
import styles from './LoadingSpinner.module.scss';

const LoadingSpinner: React.FC = () => {
  return (
    <div className={styles['loading-spinner__wrapper']}>
      <Spinner height={92} width={92} />
      <p className={styles['loading-spinner__text']}>Aguarde, carregando...</p>
    </div>
  );
};

export default LoadingSpinner;

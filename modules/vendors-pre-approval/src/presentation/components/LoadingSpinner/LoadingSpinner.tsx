import { Spinner } from '@shared/ui';
import styles from './LoadingSpinner.module.scss';

const LoadingSpinner: React.FC = () => {
  return (
    <div className={styles['loading-spinner__wrapper']}  data-testid='loading-spinner'>
      <Spinner height={25} width={25}/>
    </div>
  );
};

export default LoadingSpinner;

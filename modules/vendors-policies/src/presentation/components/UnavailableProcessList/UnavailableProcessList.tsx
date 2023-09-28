import { useContext } from 'react';
import { Divider, ThemeContext } from 'junto-design-system';
import { ReactComponent as UnderConstructionIllustration } from './assets/under-construction.svg';
import styles from './UnavailableProcessList.module.scss';

const UnavailableProcessList: React.FC = () => {
  const theme = useContext(ThemeContext);

  return (
    <div className={styles['unavailable-process-list__wrapper']}>
      <Divider orientation="horizontal" />
      <div>
        <UnderConstructionIllustration />
        <h2 className={styles[theme]}>
          Lista indisponível
        </h2>
        <p className={styles[theme]}>
          Esta lista não está disponível no momento. Em breve você conseguirá acessá-la.
        </p>
      </div>
    </div>
  );
};

export default UnavailableProcessList;

import { useContext } from 'react';
import { Divider, ThemeContext } from 'junto-design-system';
import { ReactComponent as UnderConstructionIllustration } from './assets/under-construction.svg';
import styles from './UnavailableProcessList.module.scss';

interface UnavailableProcessListProps {
  hasError: boolean;
}

const UnavailableProcessList: React.FC<UnavailableProcessListProps> = ({
  hasError,
}) => {
  const theme = useContext(ThemeContext);

  return (
    <div className={styles['unavailable-process-list__wrapper']}>
      <Divider orientation="horizontal" />
      <div>
        <UnderConstructionIllustration />
        <h2 className={styles[theme]}>
          {hasError ? 'Lista indisponível' : 'Lista em construção'}
        </h2>
        <p className={styles[theme]}>
          {hasError
            ? 'Esta lista não está disponível no momento. Em breve você conseguirá acessá-la.'
            : 'Estamos trabalhando no desenvolvimento dessa lista. Em breve disponibilizaremos ela para você.'}
        </p>
      </div>
    </div>
  );
};

export default UnavailableProcessList;

import { useContext } from 'react';
import { Button, Divider, ThemeContext } from 'junto-design-system';
import { ReactComponent as EmptyIllustration } from './assets/empty-illustration.svg';
import styles from './EmptyProcessList.module.scss';

const EmptyProcessList: React.FC = () => {
  const theme = useContext(ThemeContext);

  const handleButtonClick = () => {
    window.location.assign('/proposal');
  };

  return (
    <div className={styles['empty-process-list__wrapper']}>
      <Divider orientation="horizontal" />
      <div>
        <EmptyIllustration />
        <h2 className={styles[theme]}>Você ainda não possui processos</h2>
        <p className={styles[theme]}>
          Assim que houverem garantias solicitadas, elas serão listadas aqui
          para acompanhamento.
        </p>
        <Button
          data-testid="emptyProcessList-button-proposal"
          onClick={() => handleButtonClick()}
        >
          Solicitar garantia
        </Button>
      </div>
    </div>
  );
};

export default EmptyProcessList;

import { Button } from 'junto-design-system';
import { FunctionComponent } from 'react';
import { useHistory } from 'react-router';
import { JuntoLogoDark } from '@shared/ui';
import { ReactComponent as AnalysisIcon } from './assets/analysis-icon.svg';
import styles from './AppointmentLetterSentContainer.module.scss';

const AppointmentLetterSentContainer: FunctionComponent = () => {
  const history = useHistory();

  const handleGoToProcessList = () => {
    window.location.assign(process.env.NX_GLOBAL_BROKER_PROCESSES_URL || '');
  };

  const handleGoToNewQuote = () => {
    history.push('/');
  };

  return (
    <section className={styles['appointment-letter-sent-container__wrapper']}>
      <header className={styles['appointment-letter-sent-container__header']}>
        <JuntoLogoDark />
      </header>
      <div className={styles['appointment-letter-sent-container__content']}>
        <AnalysisIcon />
        <h1 className={styles['appointment-letter-sent-container__title']}>
          Sua carta de nomeação está em análise!
        </h1>
        <p className={styles['appointment-letter-sent-container__text']}>
          Em breve você receberá o retorno da nossa equipe. Clique abaixo para
          ver os detalhes e o status da proposta.
        </p>
        <div
          className={
            styles['appointment-letter-sent-container__buttons-container']
          }
        >
          <Button
            id="appointmentLetterSentContainer-new-quote-button"
            data-testid="appointmentLetterSentContainer-new-quote-button"
            onClick={handleGoToNewQuote}
          >
            Fazer uma nova cotação
          </Button>
          <Button
            id="appointmentLetterSentContainer-go-to-process-button"
            data-testid="appointmentLetterSentContainer-go-to-process-button"
            variant="secondary"
            onClick={handleGoToProcessList}
          >
            Ir para lista de processos
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AppointmentLetterSentContainer;

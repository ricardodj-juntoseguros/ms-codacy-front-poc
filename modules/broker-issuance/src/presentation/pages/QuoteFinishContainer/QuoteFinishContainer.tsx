import { Button } from 'junto-design-system';
import { FunctionComponent } from 'react';
import { useHistory } from 'react-router';
import { ReactComponent as AnalysisIcon } from '../../assets/analysis-icon.svg';
import { ReactComponent as JuntoLogo } from '../../assets/junto-logo.svg';

import styles from './QuoteFinishContainer.module.scss';

const QuoteFinishContainer: FunctionComponent = () => {
  const history = useHistory();

  const handleGoToProcessList = () => {
    window.location.assign(process.env.NX_GLOBAL_BROKER_PROCESSES_URL || '');
  };

  const handleGoToNewQuote = () => {
    history.push('/');
  };

  return (
    <section className={styles['quote-finish-container__wrapper']}>
      <header className={styles['quote-finish-container__header']}>
        <JuntoLogo />
      </header>
      <div className={styles['quote-finish-container__content']}>
        <AnalysisIcon />
        <h1 className={styles['quote-finish-container__title']}>
          Sua carta de nomeação está em análise!
        </h1>
        <p className={styles['quote-finish-container__text']}>
          Em breve você receberá o retorno da nossa equipe. Clique abaixo para
          ver os detalhes e o status da proposta.
        </p>
        <div className={styles['quote-finish-container__buttons-container']}>
          <Button
            id="quoteFinishContainer-new-quote-button"
            data-testid="quoteFinishContainer-new-quote-button"
            onClick={handleGoToNewQuote}
          >
            Fazer uma nova cotação
          </Button>
          <Button
            id="quoteFinishContainer-go-to-process-button"
            data-testid="quoteFinishContainer-go-to-process-button"
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

export default QuoteFinishContainer;

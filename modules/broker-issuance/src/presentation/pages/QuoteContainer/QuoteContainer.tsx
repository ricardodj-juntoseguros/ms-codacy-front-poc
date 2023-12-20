import { FlowProvider } from '@shared/hooks';
import * as ALL_STEPS from '../../../constants/steps';
import styles from './QuoteContainer.module.scss';
import { useProposalResume } from '../../hooks';

const QuoteContainer = () => {
  const finishedLoadingResume = useProposalResume();

  return (
    <div className={styles['quote-container__wrapper']}>
      {finishedLoadingResume ? (
        <FlowProvider
          allSteps={Object.values(ALL_STEPS).flat()}
          initialSteps={ALL_STEPS.DEFAULT_STEP}
          showFinishedSteps={false}
        />
      ) : (
        'Carregando'
      )}
    </div>
  );
};
export default QuoteContainer;

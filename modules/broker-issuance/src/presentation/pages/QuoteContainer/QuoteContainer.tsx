import { FlowProvider } from '@shared/hooks';
import * as ALL_STEPS from '../../../constants/steps';
import styles from './QuoteContainer.module.scss';
import { useProposalResume } from '../../hooks';
import { QuoteContainerSkeleton } from '../../components/Skeletons';

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
        <QuoteContainerSkeleton />
      )}
    </div>
  );
};
export default QuoteContainer;

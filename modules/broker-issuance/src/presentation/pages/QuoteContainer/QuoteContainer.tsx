import { FlowProvider } from '@shared/hooks';
import * as ALL_STEPS from '../../../constants/steps';
import styles from './QuoteContainer.module.scss';
import { useProposalResume } from '../../hooks';
import { QuoteContainerSkeleton } from '../../components/Skeletons';
import Header from '../../components/Header';
import SideSummary from '../../components/SideSummary';

const QuoteContainer = () => {
  const finishedLoadingResume = useProposalResume();

  return (
    <div className={styles['quote-container__wrapper']}>
      <Header />
      {finishedLoadingResume ? (
        <>
          <section className={styles['quote-container__flow-wrapper']}>
            <FlowProvider
              allSteps={Object.values(ALL_STEPS).flat()}
              initialSteps={ALL_STEPS.DEFAULT_STEP}
              showFinishedSteps={false}
            >
              <SideSummary />
            </FlowProvider>
          </section>
        </>
      ) : (
        <QuoteContainerSkeleton />
      )}
    </div>
  );
};
export default QuoteContainer;

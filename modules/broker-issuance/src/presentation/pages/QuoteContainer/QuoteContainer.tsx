/* eslint-disable react-hooks/exhaustive-deps */
import { FlowProvider } from '@shared/hooks';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { REDIRECT_TO_V3_INFOS } from '../../../constants';
import * as ALL_STEPS from '../../../constants/steps';
import styles from './QuoteContainer.module.scss';
import { useProposalResume } from '../../hooks';
import { QuoteContainerSkeleton } from '../../components/Skeletons';
import Header from '../../components/Header';
import SideSummary from '../../components/SideSummary';
import { useRehydrateData } from '../../hooks/useRehydrateData';

const QuoteContainer = () => {
  const finishedLoadingResume = useProposalResume();
  const rehydrateData = useRehydrateData();

  useEffect(() => {
    const cookie = Cookies.get(REDIRECT_TO_V3_INFOS);
    if (cookie) rehydrateData();
  }, []);

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

/* eslint-disable react-hooks/exhaustive-deps */
import { FlowProvider } from '@shared/hooks';
import { useEffect, useMemo, useRef } from 'react';
import Cookies from 'js-cookie';
import * as ALL_STEPS from '../../../constants/steps';
import { REDIRECT_TO_V3_INFOS } from '../../../constants';
import styles from './QuoteContainer.module.scss';
import { useProposalResume } from '../../hooks';
import { QuoteContainerSkeleton } from '../../components/Skeletons';
import Header from '../../components/Header';
import SideSummary from '../../components/SideSummary';
import { useRehydrateData } from '../../hooks/useRehydrateData';

const QuoteContainer = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const finishedLoadingResume = useProposalResume();
  const rehydrateData = useRehydrateData();

  const modalitySteps = useMemo(() => {
    const arrayAllSteps = Object.values(ALL_STEPS).flat();
    const newArray: any[] = [];
    for (let i = 0; i < arrayAllSteps.length; i += 1) {
      const exists = newArray.findIndex(
        step => step.name === arrayAllSteps[i].name,
      );
      if (exists === -1) newArray.push(arrayAllSteps[i]);
    }
    return newArray;
  }, []);

  useEffect(() => {
    const cookie = Cookies.get(REDIRECT_TO_V3_INFOS);
    if (cookie) rehydrateData();
  }, []);

  return (
    <div ref={wrapperRef} className={styles['quote-container__wrapper']}>
      <Header />
      {finishedLoadingResume ? (
        <>
          <section className={styles['quote-container__flow-wrapper']}>
            <FlowProvider
              allSteps={modalitySteps}
              initialSteps={ALL_STEPS.DEFAULT_STEP}
              showFinishedSteps={false}
              wrapperRef={wrapperRef}
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

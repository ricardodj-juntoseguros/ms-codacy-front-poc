/* eslint-disable react-hooks/exhaustive-deps */
import { FlowProvider } from '@shared/hooks';
import { useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';
import { selectQuote } from '../../../application/features/quote/QuoteSlice';
import { MODALITY_STEPS } from '../../../constants/steps/modalitySteps';
import { DEFAULT_STEP } from '../../../constants/steps';
import { REDIRECT_TO_V3_INFOS } from '../../../constants';
import styles from './QuoteContainer.module.scss';
import { useProposalResume } from '../../hooks';
import { QuoteContainerSkeleton } from '../../components/Skeletons';
import Header from '../../components/Header';
import SideSummary from '../../components/SideSummary';
import { useRehydrateData } from '../../hooks/useRehydrateData';

const QuoteContainer = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { modality } = useSelector(selectQuote);
  const finishedLoadingResume = useProposalResume();
  const rehydrateData = useRehydrateData();

  useEffect(() => {
    const cookie = Cookies.get(REDIRECT_TO_V3_INFOS);
    if (cookie) rehydrateData();
  }, []);

  const getSteps = () => {
    if (!modality) return [...DEFAULT_STEP];
    const modalitySteps = MODALITY_STEPS[modality.id];
    return modalitySteps
      ? [...DEFAULT_STEP, ...modalitySteps]
      : [...DEFAULT_STEP];
  };

  return (
    <div ref={wrapperRef} className={styles['quote-container__wrapper']}>
      <Header />
      {finishedLoadingResume ? (
        <>
          <section className={styles['quote-container__flow-wrapper']}>
            <FlowProvider
              allSteps={getSteps()}
              initialSteps={DEFAULT_STEP}
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

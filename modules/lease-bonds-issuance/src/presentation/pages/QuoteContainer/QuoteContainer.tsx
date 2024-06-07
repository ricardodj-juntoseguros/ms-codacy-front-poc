/* eslint-disable react-hooks/exhaustive-deps */
import { FlowProvider } from '@shared/hooks';
import { useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import { REDIRECT_TO_V3_INFOS } from '../../../constants';
import * as ALL_STEPS from '../../../constants/steps';
import styles from './QuoteContainer.module.scss';
import Header from '../../components/Header';
import { useRehydrateData } from '../../hooks/useRehydrateData';

const QuoteContainer = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rehydrateData = useRehydrateData();

  useEffect(() => {
    const cookie = Cookies.get(REDIRECT_TO_V3_INFOS);
    if (cookie) rehydrateData();
  }, []);

  return (
    <div ref={wrapperRef} className={styles['quote-container__wrapper']}>
      <Header />
      <section className={styles['quote-container__flow-wrapper']}>
        <FlowProvider
          allSteps={Object.values(ALL_STEPS).flat() as any}
          initialSteps={ALL_STEPS.DEFAULT_STEP as any}
          showFinishedSteps={false}
          wrapperRef={wrapperRef}
        />
      </section>
    </div>
  );
};
export default QuoteContainer;

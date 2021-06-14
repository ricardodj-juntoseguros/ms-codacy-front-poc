import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { SearchContainer } from '../../components/searchContainer';
import { TimeframeAndCoverageContainer } from '../../components/timeframeAndCoverageContainer';
import { RateCalculationContainer } from '../../components/rateCalculationContainer/RateCalculationContainer';
import { ContractDataContainer } from '../../components/contractDataContainer';
import {
  selectFlow,
  setSteps,
} from '../../../application/features/flow/FlowSlice';

import styles from './QuoteContainer.module.scss';

export function QuoteContainer() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setSteps([
        {
          name: 'searchContainer',
          number: 1,
          isActive: true,
          isCompleted: false,
          nextStep: 'timeframeAndCoverageContainer',
        },
        {
          name: 'timeframeAndCoverageContainer',
          number: 2,
          isActive: false,
          isCompleted: false,
          nextStep: 'rateCalculationContainer',
        },
        {
          name: 'rateCalculationContainer',
          number: 3,
          isActive: false,
          isCompleted: false,
          nextStep: 'contractDataContainer',
        },
        {
          name: 'contractDataContainer',
          number: 4,
          isActive: false,
          isCompleted: false,
          nextStep: '',
        },
      ]),
    );
  }, []);
  const { steps } = useSelector(selectFlow);
  const searchStepConfig = steps.find(step => step.name === 'searchContainer');

  return (
    <div className={styles['quote-container__wrapper']}>
      <SearchContainer />
      {searchStepConfig?.isCompleted && (
        <>
          <TimeframeAndCoverageContainer
            maxCoverageDays={120}
            policyholderLimit={50000}
          />
          <RateCalculationContainer />
          <ContractDataContainer />
        </>
      )}
    </div>
  );
}

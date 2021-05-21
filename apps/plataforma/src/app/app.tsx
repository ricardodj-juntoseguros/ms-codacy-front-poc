import { RateCalculation } from '@libs/plataforma/ui/src/components/rate-calculation';
import { StepContainer } from '@libs/shared/ui/src/components/step-container';
import { TimeframeAndCoverage } from '@libs/plataforma/ui/src/components/timeframe-and-coverage';
import React, { useState } from 'react';

import styles from './app.module.scss';

export function App() {
  const [standardRateValue, setStandardRateValue] = useState<number>();
  const [iDate, setIDate] = useState(new Date());
  const [fDate, setFDate] = useState(null);
  const [durationInDays, setDurationInDays] = useState(null);
  const [coverageValue, setCoverageValue] = useState(null);

  const handleDownloadQuote = () => {
    alert('Download');
  };

  const handleChangeStandardRate = (value: number) => {
    setStandardRateValue(value);
  };

  return (
    <div className={styles.container}>
      <StepContainer
        stepNumber={1}
        title={
          <title>
            Calcule a <strong>taxa</strong>
          </title>
        }
      >
        <RateCalculation
          maxRate="11,99"
          finalPrize="12.994,31"
          finalCommission="2.130,43"
          comissionPercent="21"
          handleDownloadQuote={handleDownloadQuote}
          standardRateValue={standardRateValue}
          handleChangeStandardRate={handleChangeStandardRate}
        />
      </StepContainer>
      <StepContainer
        stepNumber={2}
        title={
          <title>
            Defina <strong>vigência e valor</strong>
          </title>
        }
      >
        <TimeframeAndCoverage
          timeframeStart={iDate}
          timeframeEnd={fDate}
          durationInDays={durationInDays}
          policyholderLimit={2500}
          handleTimeframeStartChange={setIDate}
          handleTimeframeEndChange={setFDate}
          handleDurationInDaysChange={setDurationInDays}
          handleCoverageValueChange={setCoverageValue}
        />
      </StepContainer>
    </div>
  );
}

export default App;

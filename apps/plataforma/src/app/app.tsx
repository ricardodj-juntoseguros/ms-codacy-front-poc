import { RateCalculation } from '@libs/plataforma/ui/src/components/rate-calculation';
import { StepContainer } from '@libs/shared/ui/src/components/step-container';
import React, { useState } from 'react';

import styles from './app.module.scss';

export function App() {
  const [standardRateValue, setStandardRateValue] = useState<number>();

  const handleDownloadQuote = () => {
    alert('Download')
  }

  const handleChangeStandardRate = (value: number) => {
    setStandardRateValue(value);
  }

  return (
    <div className={styles.container}>
      <StepContainer stepNumber={1} title={<title>Calcule a <strong>taxa</strong></title>}>
        <RateCalculation
            maxRate='11,99'
            finalPrize='12.994,31'
            finalCommission='2.130,43'
            comissionPercent='21'
            handleDownloadQuote={handleDownloadQuote}
            standardRateValue={standardRateValue}
            handleChangeStandardRate={handleChangeStandardRate}
        />
      </StepContainer>
    </div>
  );
}

export default App;

import { StepContainer } from "@libs/shared/ui";
import { useState } from "react";
import { RateCalculation } from "../rate-calculation";

export function RateCalculationContainer() {
  const [maxRate, setMaxRate] = useState('');
  const [finalPrize, setFinalPrize] = useState('');
  const [finalCommission, setFinalCommission] = useState('');
  const [comissionPercent, setComissionPercent] = useState('');
  const [standardRateValue, setStandardRateValue] = useState(0);

  function handleChangeStandardRate(value: number) {
    setStandardRateValue(value);
  }

  function handleDownloadQuote() {
    console.log('download')
  }

  function StepTitle() {
    return (
      <title>
        Calcule a <strong>taxa</strong>
      </title>
    )
  }

  return (
    <div>
      <StepContainer stepNumber={3} title={StepTitle()} active>
        <RateCalculation
          maxRate={maxRate}
          finalPrize={finalPrize}
          finalCommission={finalCommission}
          comissionPercent={comissionPercent}
          standardRateValue={standardRateValue}
          handleChangeStandardRate={() => handleChangeStandardRate}
          handleDownloadQuote={() => handleDownloadQuote}
        />
      </StepContainer>
    </div>
  );
}

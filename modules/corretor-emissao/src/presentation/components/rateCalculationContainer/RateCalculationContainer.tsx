import { StepContainer } from '@libs/shared/ui';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectFlow,
  setStepStatus,
} from '../../../application/features/flow/FlowSlice';
import {
  selectQuote,
  setStandardRate,
} from '../../../application/features/quote/QuoteSlice';
import { RateCalculation } from '../rateCalculation';

export function RateCalculationContainer() {
  const dispatch = useDispatch();
  const { pricing } = useSelector(selectQuote);

  const { maxRate, finalPrize, commissionValue, commissionFee, feeStandard } =
    pricing;

  const { steps } = useSelector(selectFlow);
  const stepConfig = steps.find(
    step => step.name === 'rateCalculationContainer',
  );

  function handleChangeStandardRate(value: number) {
    dispatch(setStandardRate(value));
    if (stepConfig) {
      dispatch(
        setStepStatus({
          ...stepConfig,
          isCompleted: true,
        }),
      );
    }
  }

  useEffect(() => {
    if (feeStandard) {
      dispatch(
        setStepStatus({ name: 'rateCalculationContainer', isCompleted: true }),
      );
    }
  }, [dispatch, feeStandard]);

  function handleDownloadQuote() {
    console.log('download');
  }

  function StepTitle() {
    return (
      <title>
        Calcule a <strong>taxa</strong>
      </title>
    );
  }

  return (
    <div>
      <StepContainer
        stepNumber={stepConfig?.number}
        title={StepTitle()}
        active={stepConfig?.isActive}
      >
        <RateCalculation
          maxRate={maxRate}
          finalPrize={finalPrize}
          finalCommission={commissionValue}
          comissionPercent={commissionFee}
          standardRateValue={feeStandard}
          handleChangeStandardRate={value => handleChangeStandardRate(value)}
          handleDownloadQuote={() => handleDownloadQuote}
        />
      </StepContainer>
    </div>
  );
}

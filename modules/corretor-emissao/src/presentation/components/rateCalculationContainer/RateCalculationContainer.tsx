import { StepContainer } from '@shared/ui';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStepByName } from '../../../helpers';
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
  const { steps } = useSelector(selectFlow);

  const { maxRate, finalPrize, commissionValue, commissionFee, feeStandard } =
    pricing;

  const stepStatus = useMemo(() => {
    return getStepByName('RateCalculationContainer', steps);
  }, [steps]);

  function handleChangeStandardRate(value: number) {
    dispatch(setStandardRate(value));
    if (stepStatus) {
      dispatch(
        setStepStatus({
          ...stepStatus,
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
        stepNumber={stepStatus?.number}
        title={StepTitle()}
        active={stepStatus?.isActive}
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

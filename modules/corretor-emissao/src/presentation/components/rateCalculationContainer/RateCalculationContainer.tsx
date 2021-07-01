import { StepContainer } from '@shared/ui';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStepByName } from '../../../helpers';
import {
  selectFlow,
  advanceStep,
  setStepStatus,
} from '../../../application/features/flow/FlowSlice';
import {
  selectQuote,
  setStandardRate,
} from '../../../application/features/quote/QuoteSlice';
import { RateCalculation } from '../rateCalculation';
import { generateQuote } from '../../../application/features/quote/thunks/GenerateQuoteThunk';

const stepName = 'RateCalculationContainer';

export function RateCalculationContainer() {
  const dispatch = useDispatch();
  const { pricing, loadingQuote, timeframeAndCoverage } =
    useSelector(selectQuote);
  const { steps } = useSelector(selectFlow);

  const { maxRate, finalPrize, commissionValue, commissionFee, feeStandard } =
    pricing;

  const stepStatus = useMemo(() => {
    return getStepByName(stepName, steps);
  }, [steps]);

  function StepTitle() {
    return (
      <title>
        Calcule a <strong>taxa</strong>
      </title>
    );
  }

  function handleChangeStandardRate(value: number) {
    dispatch(setStandardRate(value));
  }

  useEffect(() => {
    if (stepStatus && stepStatus.isActive && feeStandard) {
      dispatch(advanceStep({ name: stepName }));
      dispatch(setStepStatus({ ...stepStatus, isLoading: false }));
    }
  }, [dispatch, feeStandard, stepStatus]);

  function handleDownloadQuote() {
    console.log('download');
  }

  function goNextStep() {
    dispatch(generateQuote(timeframeAndCoverage));
  }

  return (
    <div>
      <StepContainer
        stepNumber={stepStatus?.number}
        isVisible={stepStatus?.isVisible}
        isEnabled={stepStatus?.isEnabled}
        isLoading={stepStatus?.isLoading || loadingQuote}
        title={StepTitle()}
      >
        <RateCalculation
          maxRate={maxRate}
          finalPrize={finalPrize}
          finalCommission={commissionValue}
          commissionPercent={commissionFee}
          standardRateValue={feeStandard}
          handleChangeStandardRate={handleChangeStandardRate}
          handleDownloadQuote={handleDownloadQuote}
          handleEndEditing={goNextStep}
        />
      </StepContainer>
    </div>
  );
}

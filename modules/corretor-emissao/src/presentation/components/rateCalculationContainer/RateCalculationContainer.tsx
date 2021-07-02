import { StepContainer } from '@shared/ui';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStepByName } from '../../../helpers';
import {
  selectFlow,
  flowSliceActions,
} from '../../../application/features/flow/FlowSlice';
import {
  selectQuote,
  quoteSliceActions,
} from '../../../application/features/quote/QuoteSlice';
import { RateCalculation } from '../rateCalculation';
import { quoteSliceThunks } from '../../../application/features/quote/thunks';

const stepName = 'RateCalculationContainer';

export function RateCalculationContainer() {
  const [feeError, setFeeError] = useState('');
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
    dispatch(quoteSliceActions.setStandardRate(value));
    setFeeError(Number.isNaN(value) ? 'É necessário informar uma taxa.' : '');
  }

  useEffect(() => {
    if (stepStatus && stepStatus.isActive && feeStandard) {
      dispatch(flowSliceActions.advanceStep({ name: stepName }));
      dispatch(
        flowSliceActions.setStepStatus({ ...stepStatus, isLoading: false }),
      );
      dispatch(
        flowSliceActions.setStepStatus({
          name: stepStatus.nextStep,
          isEnabled: true,
          isLoading: false,
          isVisible: true,
        }),
      );
    }
  }, [dispatch, feeStandard, stepStatus]);

  function handleDownloadQuote() {
    console.log('download');
  }

  function goNextStep() {
    if (feeError) return;
    dispatch(quoteSliceThunks.generateQuote(timeframeAndCoverage));
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
          errorMessage={feeError}
        />
      </StepContainer>
    </div>
  );
}

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

export const stepName = 'RateCalculationContainer';

export function RateCalculationContainer() {
  const dispatch = useDispatch();
  const { pricing } = useSelector(selectQuote);
  const { steps } = useSelector(selectFlow);

  const { maxRate, finalPrize, commissionValue, commissionFee, feeStandard } =
    pricing;

  const stepStatus = useMemo(() => {
    return getStepByName(stepName, steps);
  }, [steps]);

  function handleChangeStandardRate(value: number) {
    if (stepStatus) {
      dispatch(setStandardRate(value));
    }
  }

  useEffect(() => {
    if (feeStandard && stepStatus && stepStatus.isActive) {
      dispatch(advanceStep({ name: stepName }));
      dispatch(setStepStatus({ ...stepStatus, isLoading: false }));
      dispatch(
        setStepStatus({
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
        isVisible={stepStatus?.isVisible}
        isEnabled={stepStatus?.isEnabled}
        isLoading={stepStatus?.isLoading}
        title={StepTitle()}
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

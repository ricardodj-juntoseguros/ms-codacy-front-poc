import { useCallback, useEffect, useMemo, useState } from 'react';
import { StepContainer } from '@shared/ui';
import { useDispatch, useSelector } from 'react-redux';
import { isAfter } from 'date-fns';
import { quoteSliceThunks } from '../../../application/features/quote/thunks';
import {
  selectFlow,
  flowSliceActions,
} from '../../../application/features/flow/FlowSlice';
import { TimeframeAndCoverage } from '../timeframeAndCoverage';
import {
  selectQuote,
  quoteSliceActions,
} from '../../../application/features/quote/QuoteSlice';
import {
  getStepByName,
  parseDateToString,
  parseStringToDate,
} from '../../../helpers';

const stepName = 'TimeframeAndCoverageContainer';

export function TimeframeAndCoverageContainer() {
  const maxCoverageDays = 120;
  const policyholderLimit = 3857329;
  const [errorMessageDate, setErrorMessageDate] = useState('');
  const [errorMessageCoverageDays, setErrorMessageCoverageDays] = useState('');
  const [errorMessageCoverageAmount, setErrorMessageCoverageAmount] =
    useState('');

  const dispatch = useDispatch();
  const { timeframeAndCoverage } = useSelector(selectQuote);
  const { timeframeStart, timeframeEnd, durationInDays, coverageValue } =
    timeframeAndCoverage;
  const { steps } = useSelector(selectFlow);

  const stepStatus = useMemo(() => {
    return getStepByName(stepName, steps);
  }, [steps]);

  function StepTitle() {
    return (
      <title>
        Defina <strong>vigência</strong> e <strong>valor</strong>
      </title>
    );
  }

  function handleCoverageValueChange(value: number) {
    dispatch(quoteSliceActions.setCoverage(value));
  }

  function handleDurationInDaysChange(value: number) {
    dispatch(quoteSliceActions.setDurationInDays(value));
  }

  function handleTimeframeStartChange(value: string) {
    dispatch(quoteSliceActions.setTimeframeStart(value));
  }

  function handleTimeframeEndChange(value: string) {
    dispatch(quoteSliceActions.setTimeframeEnd(value));
  }

  useEffect(() => {
    handleTimeframeStartChange(parseDateToString(new Date()));
  }, []);

  const validateDatesCoverage = useCallback(
    (dateStart: Date, dateEnd: Date) => {
      if (isAfter(dateStart, dateEnd)) {
        setErrorMessageDate(
          'A data do fim da vigência não pode ser anterior ou igual a de início.',
        );
        return false;
      }

      setErrorMessageDate('');
      return true;
    },
    [],
  );

  const validateMaxCoverageDays = useCallback(() => {
    if (!durationInDays) {
      setErrorMessageCoverageDays(`Informe a duração da vigência!`);
      return false;
    }

    if (durationInDays > maxCoverageDays) {
      setErrorMessageCoverageDays(
        `A duração da virgência não pode ser superior a ${maxCoverageDays} dias.`,
      );
      return false;
    }

    if (durationInDays < 1) {
      setErrorMessageCoverageDays(
        'A cobertura precisa ter pelo menos um dia de duração.',
      );
      return false;
    }

    setErrorMessageCoverageDays('');
    return true;
  }, [durationInDays, maxCoverageDays]);

  const validateCoverageAmount = useCallback(() => {
    if (!coverageValue) {
      setErrorMessageCoverageAmount('Digite o valor da cobertura!');
      return false;
    }

    if (coverageValue > policyholderLimit) {
      setErrorMessageCoverageAmount(
        'O valor de cobertura não pode ser maior que o limite.',
      );
      return false;
    }

    setErrorMessageCoverageAmount('');
    return true;
  }, [coverageValue, policyholderLimit]);

  const isValidStep = useMemo(() => {
    const startDate = parseStringToDate(timeframeStart);
    const endDate = parseStringToDate(timeframeEnd);

    if (
      startDate &&
      endDate &&
      validateDatesCoverage(startDate, endDate) &&
      validateMaxCoverageDays() &&
      validateCoverageAmount()
    ) {
      return true;
    }

    return false;
  }, [
    timeframeEnd,
    timeframeStart,
    validateCoverageAmount,
    validateDatesCoverage,
    validateMaxCoverageDays,
  ]);

  function goNextStep() {
    if (isValidStep && coverageValue && durationInDays && stepStatus) {
      dispatch(quoteSliceThunks.generateQuote(timeframeAndCoverage));
      dispatch(flowSliceActions.advanceStep({ name: stepName }));
      dispatch(
        flowSliceActions.setStepStatus({
          name: stepStatus.nextStep,
          isEnabled: true,
          isLoading: true,
          isVisible: true,
        }),
      );
    }
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
        <TimeframeAndCoverage
          policyholderLimit={policyholderLimit}
          coverageValue={coverageValue}
          durationInDays={durationInDays}
          timeframeEnd={timeframeEnd}
          timeframeStart={timeframeStart}
          maxCoverageDays={maxCoverageDays}
          errorMessageDate={errorMessageDate}
          errorMessageCoverageDays={errorMessageCoverageDays}
          errorMessageCoverageAmount={errorMessageCoverageAmount}
          handleCoverageValueChange={handleCoverageValueChange}
          handleDurationInDaysChange={handleDurationInDaysChange}
          handleTimeframeEndChange={handleTimeframeEndChange}
          handleTimeframeStartChange={handleTimeframeStartChange}
          validateDateRange={validateDatesCoverage}
          handleEndEditing={goNextStep}
        />
      </StepContainer>
    </div>
  );
}

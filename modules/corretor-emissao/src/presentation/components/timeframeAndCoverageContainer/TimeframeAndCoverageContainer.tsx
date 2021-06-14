import { useCallback, useEffect, useMemo, useState } from 'react';
import { StepContainer } from '@libs/shared/ui';
import { useDispatch, useSelector } from 'react-redux';
import { isAfter, startOfDay } from 'date-fns';
import { TimeframeAndCoverageModel } from 'modules/corretor-emissao/src/application/types/model';
import { generateQuote } from '../../../application/features/quote/thunks/generateQuote';
import {
  selectFlow,
  setStepStatus,
} from '../../../application/features/flow/FlowSlice';
import { TimeframeAndCoverage } from '../timeframeAndCoverage';
import {
  selectQuote,
  setTimeframeAndCoverageData,
} from '../../../application/features/quote/QuoteSlice';

export interface TimeframeAndCoverageContainerProps {
  policyholderLimit: number;
  maxCoverageDays: number;
}

export function TimeframeAndCoverageContainer({
  policyholderLimit,
  maxCoverageDays,
}: TimeframeAndCoverageContainerProps) {
  const [timeframeStart, setTimeframeStart] = useState<Date | null>(
    startOfDay(new Date()),
  );
  const [timeframeEnd, setTimeframeEnd] = useState<Date | null>(null);
  const [durationInDays, setDurationInDays] = useState<number>();
  const [coverageValue, setCoverageValue] =
    useState<number | undefined>(policyholderLimit);
  const [errorMessageDate, setErrorMessageDate] = useState('');
  const [errorMessageCoverageDays, setErrorMessageCoverageDays] = useState('');
  const [errorMessageCoverageAmount, setErrorMessageCoverageAmount] =
    useState('');

  const dispatch = useDispatch();
  const { timeframeAndCoverage } = useSelector(selectQuote);

  const { steps } = useSelector(selectFlow);
  const stepConfig = steps.find(
    step => step.name === 'timeframeAndCoverageContainer',
  );

  function StepTitle() {
    return (
      <title>
        Defina <strong>vigência</strong> e <strong>valor</strong>
      </title>
    );
  }

  function handleCoverageValueChange(value: number | undefined) {
    setCoverageValue(value);
  }

  function handleDurationInDaysChange(value: number) {
    setDurationInDays(value);
  }

  function handleTimeframeStartChange(value: Date) {
    setTimeframeStart(value);
  }

  function handleTimeframeEndChange(value: Date) {
    setTimeframeEnd(value);
  }

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

  const isValidSteep = useMemo(() => {
    if (
      timeframeStart &&
      timeframeEnd &&
      validateDatesCoverage(timeframeStart, timeframeEnd) &&
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

  useEffect(() => {
    if (isValidSteep && coverageValue && timeframeStart && durationInDays) {
      dispatch(
        setTimeframeAndCoverageData({
          timeframeStart,
          durationInDays,
          coverageValue,
        }),
      );
    } else {
      dispatch(setTimeframeAndCoverageData({} as TimeframeAndCoverageModel));
    }
  }, [
    coverageValue,
    dispatch,
    durationInDays,
    isValidSteep,
    policyholderLimit,
    timeframeEnd,
    timeframeStart,
  ]);

  useEffect(() => {
    if (isValidSteep && coverageValue && timeframeStart && durationInDays) {
      dispatch(
        setStepStatus({
          name: 'timeframeAndCoverageContainer',
          isCompleted: true,
        }),
      );
      dispatch(generateQuote(timeframeAndCoverage));
    }
  }, [
    coverageValue,
    dispatch,
    durationInDays,
    isValidSteep,
    timeframeAndCoverage,
    timeframeStart,
  ]);

  return (
    <div>
      <StepContainer
        stepNumber={stepConfig?.number}
        title={StepTitle()}
        active={stepConfig?.isActive}
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
        />
      </StepContainer>
    </div>
  );
}

import { useCallback, useEffect, useMemo, useState } from 'react';
import { StepContainer } from '@libs/shared/ui';
import { useDispatch } from 'react-redux';
import { isAfter } from 'date-fns';
import { TimeframeAndCoverage } from '../timeframeAndCoverage';
import {
  setFormData,
  reset,
} from '../../../application/features/timeframeAndCoverage/TimeframeAndCoverageSlice';

export function TimeframeAndCoverageContainer() {
  const [timeframeStart, setTimeframeStart] = useState<Date | null>(new Date());
  const [timeframeEnd, setTimeframeEnd] = useState<Date | null>(null);
  const [durationInDays, setDurationInDays] = useState<number>(0);
  const [coverageValue, setCoverageValue] = useState<number>(50000);
  const [policyholderLimit, setPolicyholderLimit] = useState(50000);
  const [maxCoverageDays, setMaxCoverageDays] = useState(120);
  const [errorMessageDate, setErrorMessageDate] = useState('');
  const [errorMessageCoverageDays, setErrorMessageCoverageDays] = useState('');
  const [errorMessageCoverageAmount, setErrorMessageCoverageAmount] =
    useState('');

  const dispatch = useDispatch();

  function StepTitle() {
    return (
      <title>
        Defina <strong>vigência</strong> e <strong>valor</strong>
      </title>
    );
  }

  function handleCoverageValueChange(value: number) {
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
    if (isValidSteep) {
      dispatch(
        setFormData({
          timeframeStart,
          timeframeEnd,
          durationInDays,
          coverageValue,
          policyholderLimit,
        }),
      );
    } else {
      dispatch(reset());
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

  return (
    <div>
      <StepContainer stepNumber={2} title={StepTitle()} active>
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

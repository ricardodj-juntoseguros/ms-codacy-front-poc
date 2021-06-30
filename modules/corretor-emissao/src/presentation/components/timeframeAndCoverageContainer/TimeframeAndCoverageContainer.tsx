import { useCallback, useMemo, useState } from 'react';
import { StepContainer } from '@shared/ui';
import { useDispatch, useSelector } from 'react-redux';
import { isAfter, formatISO } from 'date-fns';
import { TimeframeAndCoverageModel } from 'modules/corretor-emissao/src/application/types/model';
import { generateQuote } from '../../../application/features/quote/thunks/GenerateQuoteThunk';
import {
  selectFlow,
  advanceStep,
  setStepStatus,
} from '../../../application/features/flow/FlowSlice';
import { TimeframeAndCoverage } from '../timeframeAndCoverage';
import {
  selectQuote,
  setTimeframeAndCoverageData,
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
  const [timeframeStart, setTimeframeStart] = useState(
    parseDateToString(new Date()),
  );
  const [timeframeEnd, setTimeframeEnd] = useState('');
  const [durationInDays, setDurationInDays] = useState('');
  const [coverageValue, setCoverageValue] = useState('');
  const [errorMessageDate, setErrorMessageDate] = useState('');
  const [errorMessageCoverageDays, setErrorMessageCoverageDays] = useState('');
  const [errorMessageCoverageAmount, setErrorMessageCoverageAmount] =
    useState('');

  const dispatch = useDispatch();
  const { timeframeAndCoverage } = useSelector(selectQuote);

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

  function handleCoverageValueChange(value: string) {
    setCoverageValue(value);
  }

  function handleDurationInDaysChange(value: string) {
    setDurationInDays(value);
  }

  function handleTimeframeStartChange(value: string) {
    setTimeframeStart(value);
  }

  function handleTimeframeEndChange(value: string) {
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

    const durationInDaysParsed = Number(durationInDays);
    if (durationInDaysParsed > maxCoverageDays) {
      setErrorMessageCoverageDays(
        `A duração da virgência não pode ser superior a ${maxCoverageDays} dias.`,
      );
      return false;
    }

    if (durationInDaysParsed < 1) {
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
    if (Number(coverageValue) > policyholderLimit) {
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
    const timeframeStartParsed = parseStringToDate(timeframeStart);

    if (
      isValidStep &&
      coverageValue &&
      timeframeStartParsed &&
      durationInDays &&
      stepStatus
    ) {
      dispatch(
        setTimeframeAndCoverageData({
          timeframeStart: formatISO(timeframeStartParsed),
          durationInDays: Number(durationInDays),
          coverageValue: Number(coverageValue),
        }),
      );
      dispatch(generateQuote(timeframeAndCoverage));
      dispatch(advanceStep({ name: stepName }));
      dispatch(
        setStepStatus({
          name: stepStatus.nextStep,
          isEnabled: true,
          isLoading: true,
          isVisible: true,
        }),
      );
    } else {
      dispatch(setTimeframeAndCoverageData({} as TimeframeAndCoverageModel));
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

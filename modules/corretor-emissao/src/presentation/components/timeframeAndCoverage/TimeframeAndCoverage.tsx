import { DateInput, NumberInput, CurrencyInput } from 'junto-design-system';
import { differenceInCalendarDays, add } from 'date-fns';
import {
  currencyFormatter,
  parseDateToString,
  parseStringToDate,
} from '../../../helpers';
import styles from './TimeframeAndCoverage.module.scss';

export interface TimeframeAndCoverageProps {
  timeframeStart: string;
  timeframeEnd: string;
  durationInDays: number;
  coverageValue: number;
  policyholderLimit: number;
  maxCoverageDays: number;
  errorMessageDate: string;
  errorMessageCoverageDays: string;
  errorMessageCoverageAmount: string;
  handleTimeframeStartChange: (startDate: string) => void;
  handleTimeframeEndChange: (endDate: string) => void;
  handleDurationInDaysChange: (days: number) => void;
  handleCoverageValueChange: (value: number) => void;
  validateDateRange: (dateStart: Date, dateEnd: Date) => boolean;
  handleEndEditing: () => void;
}

export function TimeframeAndCoverage({
  timeframeStart,
  timeframeEnd,
  durationInDays,
  coverageValue,
  policyholderLimit,
  maxCoverageDays,
  errorMessageDate,
  errorMessageCoverageDays,
  errorMessageCoverageAmount,
  handleTimeframeStartChange,
  handleTimeframeEndChange,
  handleDurationInDaysChange,
  handleCoverageValueChange,
  validateDateRange,
  handleEndEditing,
}: TimeframeAndCoverageProps) {
  function calculateDurationInDays(dateStart: Date, dateEnd: Date) {
    return differenceInCalendarDays(dateStart, dateEnd);
  }

  function onStartChange(value: string) {
    handleTimeframeStartChange(value);

    const dateStart = parseStringToDate(value);
    const dateEnd = parseStringToDate(timeframeEnd);

    if (dateStart && dateEnd) {
      if (!validateDateRange(dateStart, dateEnd)) return;

      handleDurationInDaysChange(calculateDurationInDays(dateStart, dateEnd));
    }
  }

  function onEndChange(value: string) {
    handleTimeframeEndChange(value);

    const dateStart = parseStringToDate(timeframeStart);
    const dateEnd = parseStringToDate(value);

    if (dateStart && dateEnd) {
      if (!validateDateRange(dateStart, dateEnd)) return;

      handleDurationInDaysChange(calculateDurationInDays(dateStart, dateEnd));
    }
  }

  function onDurationChange(duration: number) {
    handleDurationInDaysChange(duration);

    const dateStart = parseStringToDate(timeframeStart);

    if (dateStart) {
      const dateEnd = add(dateStart, { days: Number(duration) });
      handleTimeframeEndChange(parseDateToString(dateEnd));
    }
  }

  function onCoverageValueChange(value: number) {
    handleCoverageValueChange(value);
  }

  function onEndEditing() {
    handleEndEditing();
  }

  return (
    <div className={styles['timeframe-coverage__wrapper']}>
      <div className={styles['timeframe-coverage__form-row']}>
        <div>
          <DateInput
            label="Selecione o início da vigência"
            value={timeframeStart}
            onChange={event => onStartChange(event.target.value)}
            errorMessage={errorMessageDate}
            onBlur={onEndEditing}
          />
        </div>
        <div>
          <NumberInput
            label="Total de dias"
            placeholder="Total de dias"
            allowNegative={false}
            value={durationInDays}
            onChange={onDurationChange}
            maxValue={maxCoverageDays}
            maxLength={10}
            errorMessage={errorMessageCoverageDays}
            onBlur={onEndEditing}
          />
        </div>
      </div>
      <div className={styles['timeframe-coverage__form-row']}>
        <div>
          <DateInput
            label="Selecione o fim da vigência"
            value={timeframeEnd}
            onChange={event => onEndChange(event.target.value)}
            errorMessage={errorMessageDate}
            onBlur={onEndEditing}
          />
        </div>
        <div>
          <CurrencyInput
            label="Valor da cobertura"
            helperMessage={`Limite disponível: ${currencyFormatter(
              policyholderLimit,
            )}`}
            value={coverageValue}
            placeholder="R$ 00,00"
            onChange={onCoverageValueChange}
            errorMessage={errorMessageCoverageAmount}
            onBlur={onEndEditing}
          />
        </div>
      </div>
    </div>
  );
}

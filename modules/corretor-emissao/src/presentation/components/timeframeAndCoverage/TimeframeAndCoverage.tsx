import { DateInput, NumberInput, CurrencyInput } from 'junto-design-system';
import { differenceInCalendarDays, add } from 'date-fns';
import { currencyFormatter } from '../../../helpers';
import styles from './TimeframeAndCoverage.module.scss';

export interface TimeframeAndCoverageProps {
  timeframeStart: Date | null;
  timeframeEnd: Date | null;
  durationInDays?: number;
  coverageValue?: number;
  policyholderLimit: number;
  maxCoverageDays: number;
  errorMessageDate: string;
  errorMessageCoverageDays: string;
  errorMessageCoverageAmount: string;
  handleTimeframeStartChange: (startDate: Date) => void;
  handleTimeframeEndChange: (endDate: Date) => void;
  handleDurationInDaysChange: (days: number) => void;
  handleCoverageValueChange: (value?: number) => void;
  validateDateRange: (dateStart: Date, dateEnd: Date) => boolean;
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
}: TimeframeAndCoverageProps) {
  function calculateDurationInDays(dateStart: Date, dateEnd: Date): number {
    return differenceInCalendarDays(dateStart, dateEnd);
  }

  function handleStartChange(value: Date) {
    if (!timeframeEnd) return;

    handleTimeframeStartChange(value);
    if (!validateDateRange(value, timeframeEnd)) return;

    handleDurationInDaysChange(calculateDurationInDays(value, timeframeEnd));
  }

  function handleEndChange(value: Date) {
    if (!timeframeStart) return;

    handleTimeframeEndChange(value);
    if (!validateDateRange(timeframeStart, value)) return;

    handleDurationInDaysChange(calculateDurationInDays(timeframeStart, value));
  }

  function handleDurationChange(duration: number) {
    if (!timeframeStart) return;

    handleDurationInDaysChange(duration);
    handleTimeframeEndChange(add(timeframeStart, { days: duration }));
  }

  return (
    <div className={styles['timeframe-coverage__wrapper']}>
      <div className={styles['timeframe-coverage__form-row']}>
        <div className={styles['timeframe-coverage__form-field']}>
          <DateInput
            label="Selecione o início da vigência"
            value={timeframeStart}
            onChange={handleStartChange}
            errorMessage={errorMessageDate}
          />
        </div>
        <div className={styles['timeframe-coverage__form-field']}>
          <NumberInput
            label="Total de dias"
            placeholder="Total de dias"
            suffix="dias"
            allowNegative={false}
            value={durationInDays}
            onChange={value => handleDurationChange(Number(value))}
            maxValue={maxCoverageDays}
            maxLength={10}
            errorMessage={errorMessageCoverageDays}
          />
        </div>
      </div>
      <div className={styles['timeframe-coverage__form-row']}>
        <div className={styles['timeframe-coverage__form-field']}>
          <DateInput
            label="Selecione o fim da vigência"
            value={timeframeEnd}
            onChange={handleEndChange}
            errorMessage={errorMessageDate}
          />
        </div>
        <div className={styles['timeframe-coverage__form-field']}>
          <CurrencyInput
            label="Valor da cobertura"
            helperMessage={`Limite disponível: ${currencyFormatter(
              policyholderLimit,
            )}`}
            value={coverageValue}
            placeholder="R$ 00,00"
            onChange={handleCoverageValueChange}
            errorMessage={errorMessageCoverageAmount}
          />
        </div>
      </div>
    </div>
  );
}

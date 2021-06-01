import React, { useState } from 'react';
import { DateInput, NumberInput, CurrencyInput } from '@junto-design-system';
import { differenceInCalendarDays, add } from 'date-fns';
import styles from './TimeframeAndCoverage.module.scss';

export interface TimeframeAndCoverageProps {
  timeframeStart?: Date;
  timeframeEnd?: Date;
  durationInDays?: number;
  coverageValue?: number;
  policyholderLimit: number;
  handleTimeframeStartChange(startDate: Date): void;
  handleTimeframeEndChange(endDate: Date): void;
  handleDurationInDaysChange(days: number): void;
  handleCoverageValueChange(value: number): void;
}

export function TimeframeAndCoverage({
  timeframeStart = new Date(),
  timeframeEnd = new Date(),
  durationInDays,
  coverageValue,
  policyholderLimit,
  handleTimeframeStartChange,
  handleTimeframeEndChange,
  handleDurationInDaysChange,
  handleCoverageValueChange,
}: TimeframeAndCoverageProps) {
  const [errorMessage, setErrorMessage] = useState('');

  function currencyFormatter(v: any) {
    const amount = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(v);

    return `${amount}`;
  }

  function validateDateRange(dS: Date, dE: Date): boolean {
    if (dS.getTime() > dE.getTime()) {
      setErrorMessage(
        'A data de início não pode ser antes da data de fim da vigência!',
      );
      return false;
    }
    return true;
  }

  function calculateDurationInDays(dS: Date, dE: Date): number {
    return differenceInCalendarDays(dS, dE);
  }

  function handleStartChange(d: Date) {
    handleTimeframeStartChange(d);
    if (!validateDateRange(d, timeframeEnd)) {
      return;
    }
    handleDurationInDaysChange(calculateDurationInDays(d, timeframeEnd));
  }

  function handleEndChange(d: Date) {
    handleTimeframeEndChange(d);
    if (!validateDateRange(timeframeStart, d)) {
      return;
    }
    handleDurationInDaysChange(calculateDurationInDays(timeframeStart, d));
  }

  function handleDurationChange(duration: number) {
    handleDurationInDaysChange(duration);
    handleTimeframeEndChange(add(timeframeStart, { days: duration }));
  }

  return (
    <div className={styles['timeframe-coverage__wrapper']}>
      <form>
        <div className={styles['timeframe-coverage__form-row']}>
          <div className={styles['timeframe-coverage__form-field']}>
            <DateInput
              label="Selecione o início da vigência"
              value={timeframeStart}
              onChange={d => handleStartChange(d)}
              errorMessage={errorMessage}
            />
          </div>
          <div className={styles['timeframe-coverage__form-field']}>
            <DateInput
              label="Selecione o fim da vigência"
              value={timeframeEnd}
              onChange={d => handleEndChange(d)}
              errorMessage={errorMessage}
            />
          </div>
        </div>
        <div className={styles['timeframe-coverage__form-row']}>
          <div className={styles['timeframe-coverage__form-field']}>
            <NumberInput
              label="Total de dias"
              placeholder="Total de dias"
              suffix="dias"
              allowNegative={false}
              value={durationInDays}
              onChange={duration => handleDurationChange(duration)}
              maxValue={120}
              maxLength={10}
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
              onChange={value => handleCoverageValueChange(value)}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default TimeframeAndCoverage;

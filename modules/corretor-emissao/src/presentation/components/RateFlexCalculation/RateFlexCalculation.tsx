import { NumberInput, CurrencyInput } from 'junto-design-system';

import styles from './RateFlexCalculation.module.scss';

export interface RateFlexCalculationProps {
  maxRate: number;
  feeFlexValue: number;
  commissionFlexValue: number;
  rateFlexVisible: boolean;
  feeFlexEnabled: boolean;
  onChangeFeeFlex(value: number): void;
  onChangeComissionFlex(value: number): void;
  handleChangeRateFlexVisible: () => void;
  onGoNextStep: () => void;
}

export function RateFlexCalculation({
  maxRate,
  feeFlexValue,
  commissionFlexValue,
  rateFlexVisible,
  feeFlexEnabled,
  onChangeFeeFlex,
  onChangeComissionFlex,
  onGoNextStep,
  handleChangeRateFlexVisible,
}: RateFlexCalculationProps) {
  return (
    <div className={styles['rate-flex__rate-flex-wrapper']}>
      {!rateFlexVisible && (
        <div
          className={
            styles['rate-flex-calculation__rate-flex-arrow-down-wrapper']
          }
        >
          <button
            data-testid="button-rate-flex-visible"
            type="button"
            className={
              styles['rate-flex-calculation__rate-flex-button-arrow-down']
            }
            onClick={handleChangeRateFlexVisible}
          >
            <i className="icon icon-chevron-down" />
          </button>
        </div>
      )}
      {rateFlexVisible && (
        <div
          className={
            styles['rate-flex-calculation__rate-flex-calculation-wrapper']
          }
        >
          <div
            className={
              styles[
                'commission-flex-calculation__commission-flex-input-wrapper'
              ]
            }
          >
            <CurrencyInput
              data-testid="input-comission-flex"
              label="Comissão Flex"
              placeholder="Comissão Flex"
              value={commissionFlexValue}
              onChange={onChangeComissionFlex}
              disabled={feeFlexEnabled}
              onBlur={onGoNextStep}
            />
          </div>
          <div
            className={styles['rate-flex-calculation__rate-flex-input-wrapper']}
          >
            <NumberInput
              data-testid="input-rate-flex"
              label="Taxa Flex"
              placeholder="Taxa Flex"
              maxValue={maxRate}
              minValue={1}
              suffix=" %"
              allowNegative={false}
              decimalScale={2}
              onChange={onChangeFeeFlex}
              value={feeFlexValue}
              onBlur={onGoNextStep}
              disabled={!feeFlexEnabled}
            />
          </div>
          <div
            className={
              styles['rate-flex-calculation__rate-flex-arrow-up-wrapper']
            }
          >
            <button
              data-testid="button-rate-flex-not-visible"
              type="button"
              className={
                styles['rate-flex-calculation__rate-flex-button-arrow-down']
              }
              onClick={handleChangeRateFlexVisible}
            >
              <i className="icon icon-chevron-up" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

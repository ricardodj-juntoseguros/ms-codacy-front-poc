import { useMemo } from 'react';
import classNames from 'classnames';
import { currencyFormatter, thousandSeparator } from '@shared/utils';
import { Alert, Button, CurrencyInput, NumberInput } from 'junto-design-system';
import { useDispatch, useSelector } from 'react-redux';
import {
  quoteSliceActions,
  selectQuote,
} from '../../../application/features/quote/QuoteSlice';
import { MAX_STANDARD_FEE } from '../../../constants';
import { selectValidation } from '../../../application/features/validation/ValidationSlice';
import styles from './FeeCalculation.module.scss';

interface FeeCalculationProps {
  onCalculateCallback: () => void;
}

const FeeCalculation: React.FC<FeeCalculationProps> = ({
  onCalculateCallback,
}) => {
  const dispatch = useDispatch();
  const { proposalFee, currentQuote, toggleRateFlex, commissionFlex, feeFlex } =
    useSelector(selectQuote);
  const { errors } = useSelector(selectValidation);
  const { setProposalFee, setCommissionFlex, setFeeFlex } = quoteSliceActions;
  const {
    pricing: {
      commissionFlexEnabled,
      feeFlexEnabled,
      commissionFlexMaxValue,
      feeFlexMaxValue,
    },
  } = currentQuote || { pricing: {} };

  const calculateButtonDisabled = useMemo(() => {
    return !(currentQuote && proposalFee && proposalFee <= MAX_STANDARD_FEE);
  }, [currentQuote, proposalFee]);

  const renderFlexInput = () => {
    if (commissionFlexEnabled) {
      return (
        <div className={styles['fee-calculation__flex-input']}>
          <CurrencyInput
            data-testid="feeCalculation-input-commissionFlex"
            label="Comissão flex"
            value={commissionFlex}
            placeholder="R$ 0,00"
            onChange={v => dispatch(setCommissionFlex(v || NaN))}
            errorMessage={errors.commissionFlex
              ?.join('. ')
              .replace(
                '%VALUE%',
                currencyFormatter(commissionFlexMaxValue || 0),
              )}
          />
        </div>
      );
    }
    if (feeFlexEnabled) {
      return (
        <div className={styles['fee-calculation__flex-input']}>
          <NumberInput
            data-testid="feeCalculation-input-feeFlex"
            allowLeadingZeros
            fixedDecimalScale
            label="Taxa flex"
            value={feeFlex || NaN}
            suffix="%"
            decimalScale={2}
            decimalSeparator=","
            onChange={v => dispatch(setFeeFlex(v || NaN))}
            errorMessage={errors.feeFlex
              ?.join('. ')
              .replace(
                '%VALUE%',
                thousandSeparator(feeFlexMaxValue || 0, '.', 2) || '',
              )}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles['fee-calculation__wrapper']}>
      <div
        className={classNames(styles['fee-calculation__inputs'], {
          [styles['fee-calculation__inputs--has-flex-input']]: toggleRateFlex,
        })}
      >
        <NumberInput
          data-testid="feeCalculation-input-proposalFee"
          allowLeadingZeros
          fixedDecimalScale
          label="Taxa padrão"
          value={proposalFee}
          maxValue={MAX_STANDARD_FEE}
          suffix="%"
          decimalScale={2}
          decimalSeparator=","
          onChange={v => dispatch(setProposalFee(v || NaN))}
          helperMessage="Taxa padrão máxima de 11,99%"
          errorMessage={errors.proposalFee?.join('. ')}
        />
        {toggleRateFlex && renderFlexInput()}
        <Button
          mobileFullWidth
          data-testid="feeCalculation-button-calculate"
          variant="secondary"
          disabled={calculateButtonDisabled}
          onClick={() => onCalculateCallback()}
        >
          Calcular
        </Button>
      </div>
      {commissionFlexEnabled && toggleRateFlex && (
        <Alert
          variant="success"
          icon="coin"
          text={`Você pode ter uma comissão de até ${currencyFormatter(
            commissionFlexMaxValue || 0,
          )}.`}
        />
      )}
    </div>
  );
};

export default FeeCalculation;

import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { differenceInCalendarDays, add } from 'date-fns';
import { DateInput, NumberInput, CurrencyInput } from 'junto-design-system';
import { VALIDATION_MESSAGES } from '../../../constants/validationMessages';
import {
  selectValidation,
  validationActions,
} from '../../../application/features/validation/ValidationSlice';
import { policyholderLimitAdapter } from '../../../application/features/coverageData/adapters';
import {
  selectFlow,
  flowSliceActions,
} from '../../../application/features/flow/FlowSlice';
import {
  selectQuote,
  quoteSliceActions,
} from '../../../application/features/quote/QuoteSlice';
import {
  getStepByName,
  parseStringToDate,
  currencyFormatter,
  parseDateToString,
  verifyDateIsSameOrBefore,
} from '../../../helpers';
import styles from './CoverageData.module.scss';
import CoverageApi from '../../../application/features/coverageData/CoverageApi';

const stepName = 'CoverageData';

export const CoverageData: React.FC = () => {
  const dispatch = useDispatch();
  const {
    policyholder,
    modality,
    coverageData,
    policyholderLimit,
    loadingQuote,
  } = useSelector(selectQuote);
  const { errors } = useSelector(selectValidation);
  const { startDate, endDate, durationInDays, securedAmount } = coverageData;
  const { steps } = useSelector(selectFlow);

  useEffect(() => {
    const getLimitByModality = async () => {
      if (!policyholder || !modality) {
        return;
      }

      await CoverageApi.getLimitCoverage(
        policyholder.externalId,
        modality.externalId,
      )
        .then(response => {
          const policyholderLimit = policyholderLimitAdapter(response);
          dispatch(quoteSliceActions.setPolicyholderLimit(policyholderLimit));
        })
        .catch(error => console.log(error));
    };

    getLimitByModality();
  }, [dispatch, modality, policyholder]);

  const stepStatus = useMemo(() => {
    return getStepByName(stepName, steps);
  }, [steps]);

  const stepTitle = useMemo(() => {
    return (
      <title>
        Defina <strong>vigência</strong> e <strong>valor</strong>
      </title>
    );
  }, []);

  const secureAmountHelpText = useMemo(() => {
    return `Limite disponível: ${currencyFormatter(
      policyholderLimit ? policyholderLimit?.limiteDisponivel : 0,
    )}`;
  }, [policyholderLimit]);

  const showFormError = (isVisible = false, input: string, error: string) => {
    if (isVisible) {
      dispatch(
        validationActions.setErrorMessages({
          [input]: [(VALIDATION_MESSAGES as any)[error]],
        }),
      );
    } else {
      dispatch(validationActions.removeErrorMessage(input));
    }
  };

  const handleSecuredAmountChange = (value: number) => {
    dispatch(quoteSliceActions.setSecuredAmount(value));
  };

  const handleDurationInDaysChange = (value: number) => {
    dispatch(quoteSliceActions.setDurationInDays(value));
  };

  const handleStartDateChange = (value: string) => {
    dispatch(quoteSliceActions.setStartDate(value));
  };

  const handleEndDateChange = (value: string) => {
    dispatch(quoteSliceActions.setEndDate(value));
  };

  const onStartChange = (value: string) => {
    if (value) {
      handleStartDateChange(value);
    }

    const isDateValid = verifyDateIsSameOrBefore(value, endDate);

    if (isDateValid === 'Invalid date') {
      return;
    }

    if (value && endDate && !isDateValid) {
      handleDurationInDaysChange(
        differenceInCalendarDays(
          parseStringToDate(value),
          parseStringToDate(endDate),
        ),
      );
    } else {
      handleDurationInDaysChange(0);
    }
  };

  const onDurationChange = (duration: number) => {
    handleDurationInDaysChange(duration);

    if (startDate && duration > 0) {
      const dateEnd = add(parseStringToDate(startDate), {
        days: Number(duration),
      });

      handleEndDateChange(parseDateToString(dateEnd));

      showFormError(false, 'durationInDays', 'minDurationInDays');
    } else {
      showFormError(true, 'durationInDays', 'minDurationInDays');
    }
  };

  const onEndDateChange = (value: string) => {
    if (value) {
      handleEndDateChange(value);
    }

    const isDateValid = verifyDateIsSameOrBefore(startDate, value);

    if (isDateValid === 'Invalid date') {
      handleDurationInDaysChange(0);
      return;
    }

    if (startDate && value && !isDateValid) {
      handleDurationInDaysChange(
        differenceInCalendarDays(
          parseStringToDate(startDate),
          parseStringToDate(value),
        ),
      );
      showFormError(false, 'endDate', 'minValidity');
    } else {
      handleDurationInDaysChange(0);
      showFormError(true, 'endDate', 'minValidity');
    }
  };

  const onCoverageValueChange = (value: number) => {
    handleSecuredAmountChange(value);
  };

  return (
    <div>
      <div className={styles['timeframe-coverage__wrapper']}>
        <div className={styles['timeframe-coverage__form-row']}>
          <div>
            <DateInput
              label="Selecione o início da vigência"
              value={startDate}
              onChange={(value, valid) => onStartChange(value)}
              errorMessage={errors.startDate && errors.startDate[0]}
              data-testid="start-date"
            />
          </div>
          <div>
            <NumberInput
              label="Total de dias"
              placeholder="Total de dias"
              allowNegative={false}
              value={durationInDays}
              onChange={onDurationChange}
              errorMessage={errors.durationInDays && errors.durationInDays[0]}
              data-testid="duration-in-days"
            />
          </div>
        </div>
        <div className={styles['timeframe-coverage__form-row']}>
          <div>
            <DateInput
              label="Selecione o fim da vigência"
              value={endDate}
              onChange={(value, valid) => onEndDateChange(value)}
              errorMessage={errors.endDate && errors.endDate[0]}
              data-testid="end-date"
            />
          </div>
          <div>
            <CurrencyInput
              data-cy="secured-amount"
              label="Valor da cobertura"
              helperMessage={secureAmountHelpText}
              value={securedAmount}
              placeholder="R$ 00,00"
              onChange={onCoverageValueChange}
              maxValue={
                policyholderLimit?.limiteDisponivel &&
                policyholderLimit.limiteDisponivel
              }
              errorMessage={errors.securedAmount && errors.securedAmount[0]}
              data-testid="secured-amount"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

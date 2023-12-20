import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addDays, isAfter, startOfDay, subDays } from 'date-fns';
import { DateInput, NumberInput } from 'junto-design-system';
import { parseStringToDate } from '@shared/utils';
import { ValidationTypesEnum } from '../../../application/types/model';
import {
  quoteSliceActions,
  selectQuote,
} from '../../../application/features/quote/QuoteSlice';
import {
  selectValidation,
  validationActions,
} from '../../../application/features/validation/ValidationSlice';
import { ValiditySchema } from '../../../application/validations';
import {
  VALIDATION_MESSAGES,
  VARIANT_RETROACTIVE_DATE_MODALITIES,
} from '../../../constants';
import { useQuotation, useValidate } from '../../hooks';
import styles from './ValidityFields.module.scss';

interface ValidityFieldsDates {
  validityStartDate: string;
  validityEndDate: string;
  validStartDate: boolean;
  validEndDate: boolean;
}

const ValidityFields: React.FC = () => {
  const validate = useValidate();
  const { startDateValidity, endDateValidity, durationInDays, modality } =
    useSelector(selectQuote);
  const { errors } = useSelector(selectValidation);
  const dispatch = useDispatch();
  const createOrUpdateQuote = useQuotation();
  const { setStartDateValidity, setEndDateValidity, setDurationInDays } =
    quoteSliceActions;
  const { removeErrorMessage } = validationActions;
  const [dates, setDates] = useState<ValidityFieldsDates>({
    validityStartDate: startDateValidity || '',
    validStartDate: false,
    validityEndDate: endDateValidity || '',
    validEndDate: false,
  });

  useEffect(() => {
    if (startDateValidity) {
      setDates(prevDates => ({
        ...prevDates,
        validityStartDate: startDateValidity,
        validStartDate: true,
      }));
    }
  }, [startDateValidity]);

  useEffect(() => {
    if (endDateValidity) {
      setDates(prevDates => ({
        ...prevDates,
        validityEndDate: endDateValidity,
        validEndDate: true,
      }));
    }
  }, [endDateValidity]);

  const retroactiveDays = useMemo(() => {
    if (modality && VARIANT_RETROACTIVE_DATE_MODALITIES.includes(modality.id)) {
      return modality.retroactiveDays || 1095;
    }
    return 1095;
  }, [modality]);

  const minEndDateValidityValues = useMemo(() => {
    const today = startOfDay(new Date());
    if (!startDateValidity)
      return {
        date: addDays(today, 1),
        message: VALIDATION_MESSAGES.endValidityLessThanToday,
      };
    const isRetroactiveStart = isAfter(
      startOfDay(new Date()),
      parseStringToDate(startDateValidity),
    );
    const date = isRetroactiveStart
      ? addDays(today, 1)
      : addDays(parseStringToDate(startDateValidity), 1);
    const message = isRetroactiveStart
      ? VALIDATION_MESSAGES.endValidityLessThanToday
      : VALIDATION_MESSAGES.invalidValidityRange;

    return { date, message };
  }, [startDateValidity]);

  const validateForm = async (
    validationType: ValidationTypesEnum,
    formState: any,
    fields: string[],
  ) => {
    await validate(ValiditySchema, formState, validationType, fields, false);
  };

  const handleChangeStartDate = (value: string, valid: boolean) => {
    setDates(prevDates => ({
      ...prevDates,
      validityStartDate: value,
      validStartDate: valid,
    }));
    if (valid) {
      validateForm(
        ValidationTypesEnum.partial,
        {
          ...dates,
          validityStartDate: value,
          validStartDate: valid,
          retroactiveDays,
        },
        ['validityStartDate', 'validityEndDate'],
      );
      dispatch(setStartDateValidity(value));
    } else {
      dispatch(setStartDateValidity(null));
    }
  };

  const handleChangeEndDate = (value: string, valid: boolean) => {
    setDates(prevDates => ({
      ...prevDates,
      validityEndDate: value,
      validEndDate: valid,
    }));
    if (valid) {
      validateForm(
        ValidationTypesEnum.partial,
        {
          ...dates,
          validityEndDate: value,
          validEndDate: valid,
          retroactiveDays,
        },
        ['validityStartDate', 'validityEndDate'],
      );
      dispatch(setEndDateValidity(value));
    } else {
      dispatch(setEndDateValidity(null));
    }
  };

  const handleChangeDurationInDays = (value: number) => {
    dispatch(setDurationInDays(value));
    dispatch(removeErrorMessage('validityEndDate'));
  };

  return (
    <div className={styles['validity-fields__form-wrapper']}>
      <div>
        <DateInput
          data-testid="validityAndValueForm-dateinput-start-validity"
          label="Início da vigência"
          value={dates.validityStartDate}
          onChange={handleChangeStartDate}
          minDate={subDays(startOfDay(new Date()), retroactiveDays)}
          invalidMinDateMessage={
            VALIDATION_MESSAGES.initialValidityMaxRetroactive
          }
          errorMessage={errors.validityStartDate?.join('. ')}
          onBlur={() => createOrUpdateQuote()}
        />
        <DateInput
          data-testid="validityAndValueForm-dateinput-end-validity"
          label="Fim da vigência"
          value={dates.validityEndDate}
          onChange={handleChangeEndDate}
          minDate={minEndDateValidityValues.date}
          invalidMinDateMessage={minEndDateValidityValues.message}
          errorMessage={errors.validityEndDate?.join('. ')}
          onBlur={() => createOrUpdateQuote()}
        />
      </div>
      <div>
        <NumberInput
          data-testid="validityAndValueForm-input-validity-days"
          label="Vigência do seguro em dias"
          placeholder="Ex: 100 dias"
          allowNegative={false}
          onChange={value => handleChangeDurationInDays(value)}
          value={durationInDays || NaN}
          errorMessage={errors.durationInDays?.join('. ')}
          suffix=" dias"
          onBlur={() => createOrUpdateQuote()}
        />
      </div>
    </div>
  );
};

export default ValidityFields;

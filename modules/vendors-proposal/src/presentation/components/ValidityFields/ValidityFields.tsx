import { DateInput, NumberInput } from 'junto-design-system';
import { useDispatch, useSelector } from 'react-redux';
import { AnyObjectSchema } from 'yup';
import { ValidationTypesEnum } from '../../../application/types/model';
import {
  proposalActions,
  selectProposal,
} from '../../../application/features/proposal/ProposalSlice';
import styles from './ValidityFields.module.scss';
import { MIN_VALIDITY_DAYS } from '../../../constants';
import { selectValidation } from '../../../application/features/validation/ValidationSlice';
import { useValidate } from '../../hooks';

export interface ValidityFields {
  validationSchema: AnyObjectSchema;
}

const ValidityFields: React.FunctionComponent<ValidityFields> = ({
  validationSchema,
}) => {
  const { errors } = useSelector(selectValidation);
  const validate = useValidate();
  const dispatch = useDispatch();
  const { initialValidity, endValidity, validityInDays } =
    useSelector(selectProposal);

  const handleInitialValidity = (value: string, isValid: boolean) => {
    dispatch(proposalActions.setInitialValidity({ value, isValid }));
  };

  const handleEndValidity = (value: string, isValid: boolean) => {
    dispatch(proposalActions.setEndValidity({ value, isValid }));
  };

  const handleValidityInDays = (value: number) => {
    dispatch(proposalActions.setValidityInDays(value));
  };

  const validateFields = async () => {
    await validate(
      validationSchema,
      { initialValidity, endValidity, validityInDays },
      ValidationTypesEnum.partial,
      ['initialValidity', 'endValidity', 'validityInDays'],
      false,
    );
  };

  return (
    <>
      <div className={styles['validity-fields__wrapper']}>
        <DateInput
          data-testid="validityFields-date-input-initial-validity"
          value={initialValidity}
          onChange={handleInitialValidity}
          onBlur={() => validateFields()}
          label="Início da vigência"
          errorMessage={errors.initialValidity ? errors.initialValidity[0] : ''}
        />
        <DateInput
          data-testid="validityFields-date-input-end-validity"
          value={endValidity}
          label="Fim da vigência"
          maxDate={new Date('2200/01/01')}
          onChange={handleEndValidity}
          onBlur={() => validateFields()}
          errorMessage={errors.endValidity ? errors.endValidity[0] : ''}
        />
      </div>
      <NumberInput
        data-testid="validityFields-date-input-validity-days"
        label="Vigência do seguro em dias"
        placeholder="7 dias"
        minValue={MIN_VALIDITY_DAYS}
        allowNegative={false}
        onChange={handleValidityInDays}
        onBlur={() => validateFields()}
        errorMessage={errors.validityInDays ? errors.validityInDays[0] : ''}
        value={validityInDays}
      />
    </>
  );
};

export default ValidityFields;

import { useSelector } from 'react-redux';
import { InputBase } from 'junto-design-system';
import { cpfFormatter, phoneFormatter } from '@shared/utils';
import { ValidationModel } from 'modules/broker-signup/src/application/types/model';
import styles from './ResponsibleInformation.module.scss';
import {
  responsibleInformationSliceActions,
  selectResponsibleInformation,
} from '../../../application/features/responsibleInformation/ResponsibleInformationSlice';
import {
  validationActions,
  selectValidation,
  validateForm,
} from '../../../application/features/validation/ValidationSlice';
import { useAppDispatch } from '../../../config/store';
import { ResponsibleInformationDataSchema } from '../../../application/features/validations/schemas/componentSchemas';

export const ResponsibleInformation: React.FC = () => {
  const dispatch = useAppDispatch();
  const responsabileInformation = useSelector(selectResponsibleInformation);
  const { cpfResponsable, phoneNumberResponsable } = responsabileInformation;
  const { errors } = useSelector(selectValidation);

  const handleCpfChange = (value: string) => {
    dispatch(responsibleInformationSliceActions.setCpf(value));
    dispatch(validationActions.removeErrorMessage('cpf'));
  };

  const handlePhoneNumberChange = (value: string) => {
    dispatch(responsibleInformationSliceActions.setPhone(value));
    dispatch(validationActions.removeErrorMessage('phone'));
  };

  const validate = async (
    input: string,
    error: string,
    errorIsNull: string,
  ) => {
    const validateResult = await dispatch(
      validateForm({
        schema: ResponsibleInformationDataSchema,
        data: {
          documentNumberIsNull: cpfResponsable,
          documentNumber: cpfResponsable,
          phone: phoneNumberResponsable,
        },
      }),
    );
    const { errors } = validateResult.payload as ValidationModel;

    if (errors[errorIsNull] && errors[errorIsNull].length > 0) {
      dispatch(
        validationActions.setErrorMessages({
          [input]: [errors[errorIsNull][0]],
        }),
      );
      return;
    }

    if (errors[error] && errors[error].length > 0) {
      dispatch(
        validationActions.setErrorMessages({
          [input]: [errors[error][0]],
        }),
      );
    }
  };

  return (
    <div className={styles['responsible_information_wrapper']}>
      <h1>Dados da pessoa corretora</h1>
      <div className={styles['responsible_information_grid_inputs']}>
        <div
          id="brokerDetails-federalIdResponsible-input"
          className={styles['responsible_information__form-field']}
        >
          <InputBase
            data-testid="broker-federalId"
            label="CPF do responsável"
            placeholder="000.000.000-00"
            value={cpfResponsable}
            onChange={e => {
              handleCpfChange(cpfFormatter(e.target.value));
            }}
            onBlur={() =>
              validate('cpf', 'documentNumber', 'documentNumberIsNull')
            }
            errorMessage={errors.cpf && errors.cpf[0]}
          />
        </div>
        <div
          id="brokerDetails-PhoneResponsible-input"
          className={styles['responsible_information__form-field']}
        >
          <InputBase
            data-testid="broker-phone"
            label="Telefone"
            placeholder="(00) 00000-0000"
            value={phoneNumberResponsable}
            onChange={e => {
              handlePhoneNumberChange(phoneFormatter(e.target.value));
            }}
            onBlur={() => validate('phone', 'phone', 'phoneIsNull')}
            errorMessage={errors.phone && errors.phone[0]}
          />
        </div>
      </div>
    </div>
  );
};

export default ResponsibleInformation;

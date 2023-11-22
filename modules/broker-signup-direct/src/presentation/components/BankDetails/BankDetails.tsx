import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { InputBase, SearchInput } from 'junto-design-system';
import { useOptionsMapper } from '@shared/hooks';
import styles from './BankDetails.module.scss';
import { BankDTO } from '../../../application/types/dto';
import {
  brokerInformationSliceActions,
  selectBroker,
} from '../../../application/features/brokerInformation/BrokerInformationSlice';
import {
  validationActions,
  selectValidation,
} from '../../../application/features/validation/ValidationSlice';
import { VALIDATION_MESSAGES } from '../../../constants/validationMessages';
import { inputNoAcceptLetters } from '../../../helpers';

export interface BankDetailsProps {
  bankOptions: BankDTO[];
  onSelectBank: (value: BankDTO) => void;
}

export function BankDetails({ bankOptions, onSelectBank }: BankDetailsProps) {
  const brokerInformation = useSelector(selectBroker);
  const dispatch = useDispatch();
  const { errors } = useSelector(selectValidation);
  const [options, setOptions] = useState(bankOptions);

  useEffect(() => {
    setOptions(bankOptions);
  }, [bankOptions]);

  const { mappedOptions: mappedBankOptions, selectOption: setBankOption } =
    useOptionsMapper(options, 'name', 'bankCode', 'name', onSelectBank);

  const handleAccounNumber = (value: string) => {
    if (value.length <= 15) {
      dispatch(validationActions.removeErrorMessage('accounNumber'));
      dispatch(brokerInformationSliceActions.setAccounNumber(value));
    }
  };
  const handleBankNumber = (value: string) => {
    if (value.length <= 5) {
      dispatch(validationActions.removeErrorMessage('bankNumber'));
      dispatch(brokerInformationSliceActions.setBankNumber(value));
    }
  };
  const handleBankDigit = (value: string) => {
    if (value.length <= 2) {
      dispatch(brokerInformationSliceActions.setBankDigit(value));
    }
  };
  const handleAccounDigit = (value: string) => {
    if (value.length <= 2) {
      dispatch(validationActions.removeErrorMessage('accounDigit'));
      dispatch(brokerInformationSliceActions.setAccounDigit(value));
    }
  };

  const validate = (input: string, valueInput: string) => {
    if (valueInput === '') {
      dispatch(
        validationActions.setErrorMessages({
          [input]: [(VALIDATION_MESSAGES as any)[input]],
        }),
      );
    }
  };

  const handleChangePolicyholderInput = (value: string) => {
    dispatch(brokerInformationSliceActions.setBankName(value));
    const result = bankOptions.filter(
      item =>
        item.name.toUpperCase().includes(value.toUpperCase()) ||
        item.bankCode.toUpperCase().includes(value.toUpperCase()),
    );
    setOptions(result);
  };

  return (
    <div className={styles['bank_details_wrapper']}>
      <h1>Dados bancários da corretora</h1>
      <h2>
        A conta informada deve estar vinculada ao CNPJ da corretora e será
        utilizada para o depósito da comissão.{' '}
      </h2>
      <div
        id="bank_details_dropdown"
        className={styles['bank_details_dropdown']}
      >
        <SearchInput
          id="brokerDetails-bankName-searchInput"
          data-testid="policyholder-input-search"
          label="Banco"
          placeholder="Banco"
          onChange={e => handleChangePolicyholderInput(e)}
          changeValueOnSelect={false}
          value={brokerInformation.bankDetails.name}
          options={mappedBankOptions}
          onValueSelected={setBankOption}
          emptyMessage="Nenhum banco encontrado"
          onBlur={() =>
            validate('bankName', brokerInformation.bankDetails.name)
          }
          errorMessage={errors.bankName && errors.bankName[0]}
          onFocus={e => e.preventDefault()}
        />
      </div>
      <div className={styles['bank_details_grid_inputs']}>
        <div
          id="brokerDetails-bankNumber-input"
          className={styles['bank_details__form-field']}
        >
          <InputBase
            data-testid="bank-number"
            label="Agência"
            placeholder="00000"
            value={brokerInformation.bankDetails.bankNumber}
            onChange={e => {
              handleBankNumber(inputNoAcceptLetters(e.target.value));
            }}
            onBlur={() =>
              validate('bankNumber', brokerInformation.bankDetails.bankNumber)
            }
            errorMessage={errors.bankNumber && errors.bankNumber[0]}
          />
        </div>
        <div
          id="brokerDetails-bankDigit-input"
          className={styles['bank_details__form-field']}
        >
          <InputBase
            data-testid="bank-digit"
            label="Dígito da agência - opcional"
            placeholder="00"
            value={brokerInformation.bankDetails.bankDigit}
            onChange={e => {
              handleBankDigit(inputNoAcceptLetters(e.target.value));
            }}
          />
        </div>
        <div
          id="brokerDetails-accountNumber-input"
          className={styles['bank_details__form-field']}
        >
          <InputBase
            data-testid="account-number"
            label="Conta"
            placeholder="00000000"
            value={brokerInformation.bankDetails.accounNumber}
            onChange={e => {
              handleAccounNumber(inputNoAcceptLetters(e.target.value));
            }}
            onBlur={() =>
              validate(
                'accounNumber',
                brokerInformation.bankDetails.accounNumber,
              )
            }
            errorMessage={errors.accounNumber && errors.accounNumber[0]}
          />
        </div>
        <div
          id="brokerDetails-accountDigit-input"
          className={styles['bank_details__form-field']}
        >
          <InputBase
            data-testid="account-digit"
            label="Dígito da conta"
            placeholder="00"
            value={brokerInformation.bankDetails.accounDigit}
            onChange={e => {
              handleAccounDigit(inputNoAcceptLetters(e.target.value));
            }}
            onBlur={() =>
              validate('accounDigit', brokerInformation.bankDetails.accounDigit)
            }
            errorMessage={errors.accounDigit && errors.accounDigit[0]}
          />
        </div>
      </div>
    </div>
  );
}

export default BankDetails;

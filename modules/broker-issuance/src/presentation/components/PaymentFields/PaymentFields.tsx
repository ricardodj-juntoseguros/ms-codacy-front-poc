/* eslint-disable react-hooks/exhaustive-deps */
import { FunctionComponent, useEffect, useMemo, useState } from 'react';
import {
  DateInput,
  Dropdown,
  DropdownOptions,
  Skeleton,
} from 'junto-design-system';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { formatDateString, stringToInt } from '@shared/utils';
import {
  getMaxFirstDueDate,
  getMinFirstDueDate,
  mapInstallmentOptions,
} from '../../../helpers';
import {
  proposalActions,
  selectProposal,
} from '../../../application/features/proposal/ProposalSlice';
import { selectQuote } from '../../../application/features/quote/QuoteSlice';
import { useProposal, useQuotation } from '../../hooks';
import styles from './PaymentFields.module.scss';
import { selectValidation } from '../../../application/features/validation/ValidationSlice';

const PaymentFields: FunctionComponent = () => {
  const [loadingField, setLoadingField] = useState('');
  const dispatch = useDispatch();
  const createOrUpdateQuotation = useQuotation();
  const updateProposal = useProposal();
  const { paymentType, numberOfInstallments, firstDueDate, loadingProposal } =
    useSelector(selectProposal);
  const { currentQuote, submodality, endDateValidity, loadingQuote } =
    useSelector(selectQuote);
  const { errors } = useSelector(selectValidation);
  const {
    setPaymentType,
    setNumberOfInstallments,
    setFirstDueDate,
    setHasProposalChanges,
  } = proposalActions;

  const paymentTypeOptions = useMemo(() => {
    if (!submodality) return [];
    return submodality.payments.map(payment => ({
      label: payment.description,
      value: payment.id.toString(),
    }));
  }, [submodality]);

  const installmentOptions = useMemo(
    () =>
      currentQuote
        ? mapInstallmentOptions(currentQuote.installmentOptions)
        : [],
    [currentQuote],
  );

  const maxDateForFirstDueDate = useMemo(
    () => getMaxFirstDueDate(endDateValidity),
    [endDateValidity],
  );

  const minDateForFirstDueDate = useMemo(
    () => getMinFirstDueDate(endDateValidity),
    [endDateValidity],
  );

  useEffect(() => {
    if (loadingField !== '') updateProposal();
    if (loadingField === 'firstDueDate') createOrUpdateQuotation(true);
  }, [loadingField]);

  useEffect(() => {
    if (!loadingProposal) setLoadingField('');
  }, [loadingProposal]);

  useEffect(() => {
    if (paymentType === null && paymentTypeOptions.length > 0) {
      dispatch(setPaymentType(stringToInt(paymentTypeOptions[0].value)));
    }
  }, [paymentType, paymentTypeOptions]);

  useEffect(() => {
    if (currentQuote) {
      if (!numberOfInstallments && !firstDueDate) {
        dispatch(
          setFirstDueDate(
            formatDateString(
              currentQuote.installmentOptions[0].firstDueDate,
              'dd/MM/yyyy',
            ),
          ),
        );
        dispatch(
          setNumberOfInstallments(stringToInt(installmentOptions[0].value)),
        );
        dispatch(setHasProposalChanges(false));
        return;
      }
      const option = installmentOptions.find(
        option => option.value === `${numberOfInstallments}`,
      );
      if (option) {
        dispatch(setNumberOfInstallments(stringToInt(option.value)));
      }
      if (errors.firstDueDate) {
        handleFirstDueDate(format(minDateForFirstDueDate, 'dd/MM/yyyy'), true);
      }
    }
  }, [currentQuote]);

  const handlePaymentType = (optionSelected: DropdownOptions) => {
    setLoadingField('paymentType');
    dispatch(setPaymentType(stringToInt(optionSelected.value)));
  };

  const handleNumberOfInstallments = (optionSelected: DropdownOptions) => {
    setLoadingField('numberOfInstallments');
    dispatch(setNumberOfInstallments(stringToInt(optionSelected.value)));
  };

  const handleFirstDueDate = (value: string, valid: boolean) => {
    if (value === firstDueDate) return;
    dispatch(setFirstDueDate(value));
    if (valid) {
      setLoadingField('firstDueDate');
    }
  };

  const renderPaymentType = () => {
    if (paymentTypeOptions.length <= 1) return null;
    if (loadingField === 'paymentType' && loadingProposal) {
      return <Skeleton height={64} width="100%" />;
    }
    return (
      <Dropdown
        id="paymentFields-payment-type-input-dropdown"
        data-testid="paymentFields-payment-type-input-dropdown"
        label="Selecione a forma de pagamento"
        placeholder="Selecione uma opção"
        options={paymentTypeOptions}
        value={
          paymentTypeOptions.find(
            option => option.value === `${paymentType}`,
          ) || null
        }
        onValueSelected={handlePaymentType}
        loading={false}
      />
    );
  };

  const renderNumberOfInstallments = () => {
    if (
      (loadingField === 'numberOfInstallments' && loadingProposal) ||
      loadingQuote
    ) {
      return <Skeleton height={64} width="100%" />;
    }
    return (
      <Dropdown
        id="paymentFields-number-of-installments-input-dropdown"
        data-testid="paymentFields-number-of-installments-input-dropdown"
        label="Quantidade de parcelas"
        placeholder="Selecione uma opção"
        options={installmentOptions}
        value={
          installmentOptions.find(
            option => option.value === `${numberOfInstallments}`,
          ) || null
        }
        onValueSelected={handleNumberOfInstallments}
        readOnly={installmentOptions.length <= 1}
        loading={false}
      />
    );
  };

  const renderFirstDueDate = () => {
    if ((loadingField === 'firstDueDate' && loadingProposal) || loadingQuote) {
      return <Skeleton height={64} width="100%" />;
    }
    return (
      <DateInput
        id="paymentFields-first-due-date-input"
        data-testid="paymentFields-first-due-date-input"
        label="Primeira parcela"
        value={firstDueDate || ''}
        onChange={(value, valid) => handleFirstDueDate(value, valid)}
        minDate={minDateForFirstDueDate}
        maxDate={maxDateForFirstDueDate}
      />
    );
  };

  return (
    <section className={styles['payment-fields__wrapper']}>
      <p className={styles['payment-fields__text']}>Pagamento</p>
      {renderPaymentType()}
      <div className={styles['payment-fields__installment-wrapper']}>
        {renderNumberOfInstallments()}
        {renderFirstDueDate()}
      </div>
    </section>
  );
};

export default PaymentFields;

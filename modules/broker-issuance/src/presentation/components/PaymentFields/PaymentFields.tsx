/* eslint-disable react-hooks/exhaustive-deps */
import { FunctionComponent, useEffect, useMemo, useState } from 'react';
import {
  DateInput,
  Dropdown,
  DropdownOptions,
  Skeleton,
} from 'junto-design-system';
import { useDispatch, useSelector } from 'react-redux';
import { formatDateString } from '@shared/utils';
import { addDays } from 'date-fns';
import { mapInstallmentOptions } from '../../../helpers';
import {
  proposalActions,
  selectProposal,
} from '../../../application/features/proposal/ProposalSlice';
import { selectQuote } from '../../../application/features/quote/QuoteSlice';
import { useProposal, useQuotation } from '../../hooks';
import { MAX_DAYS_FOR_FIRST_DUE_DATE } from '../../../constants';

import styles from './PaymentFields.module.scss';

const PaymentFields: FunctionComponent = () => {
  const [loadingField, setLoadingField] = useState('');
  const dispatch = useDispatch();
  const createOrUpdateQuote = useQuotation();
  const updateProposal = useProposal();
  const { paymentType, numberOfInstallments, firstDueDate, loadingProposal } =
    useSelector(selectProposal);
  const { currentQuote, submodality, durationInDays, loadingQuote } =
    useSelector(selectQuote);
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

  const maxDateForFirstDueDate = useMemo(() => {
    const daysToAdd =
      durationInDays && durationInDays < MAX_DAYS_FOR_FIRST_DUE_DATE
        ? durationInDays
        : MAX_DAYS_FOR_FIRST_DUE_DATE;
    return addDays(new Date(), daysToAdd);
  }, [durationInDays]);

  useEffect(() => {
    if (currentQuote) {
      dispatch(
        setFirstDueDate(
          formatDateString(
            currentQuote.installmentOptions[0].firstDueDate,
            'dd/MM/yyyy',
          ),
        ),
      );
      dispatch(setNumberOfInstallments(installmentOptions[0]));
      dispatch(setHasProposalChanges(false));
    }
  }, []);

  useEffect(() => {
    if (currentQuote && numberOfInstallments) {
      dispatch(
        setNumberOfInstallments(
          installmentOptions.find(
            option => option.value === numberOfInstallments.value,
          ),
        ),
      );
    }
  }, [currentQuote]);

  useEffect(() => {
    if (loadingField !== '') updateProposal();
    if (loadingField === 'firstDueDate') createOrUpdateQuote();
  }, [loadingField]);

  useEffect(() => {
    if (loadingProposal === false) setLoadingField('');
  }, [loadingProposal]);

  const handlePaymentType = (optionSelected: DropdownOptions) => {
    setLoadingField('paymentType');
    dispatch(setPaymentType(optionSelected));
  };

  const handleNumberOfInstallments = (optionSelected: DropdownOptions) => {
    setLoadingField('numberOfInstallments');
    dispatch(setNumberOfInstallments(optionSelected));
  };

  const handleFirstDueDate = (value: string) => {
    if (value === firstDueDate) return;
    dispatch(setFirstDueDate(value));
    setLoadingField('firstDueDate');
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
        value={paymentType}
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
        value={numberOfInstallments}
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
        id="paymentFields-first-due-date-input-dropdown"
        data-testid="paymentFields-first-due-date-input-dropdown"
        label="Primeira parcela"
        value={firstDueDate}
        onChange={handleFirstDueDate}
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

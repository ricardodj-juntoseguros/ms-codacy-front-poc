import { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CurrencyInput, makeToast } from 'junto-design-system';
import { currencyFormatter } from '@shared/utils';
import QuotationPricingApi from '../../../application/features/quotationPricing/QuotationPricingApi';
import {
  quoteSliceActions,
  selectQuote,
} from '../../../application/features/quote/QuoteSlice';
import { selectValidation } from '../../../application/features/validation/ValidationSlice';
import { PolicyholderBalanceLimitsDTO } from '../../../application/types/dto';
import { useQuotation } from '../../hooks';

import styles from './SecuredAmount.module.scss';

interface SecuredAmountProps {
  title: string;
}

const SecuredAmount: FunctionComponent<SecuredAmountProps> = ({
  title,
  children,
}) => {
  const [policyholderLimit, setPolicyholderLimit] =
    useState<PolicyholderBalanceLimitsDTO>();
  const { securedAmount, policyholder, modality } = useSelector(selectQuote);
  const { errors } = useSelector(selectValidation);
  const dispatch = useDispatch();
  const createOrUpdateQuote = useQuotation();
  const { setSecuredAmount } = quoteSliceActions;

  useEffect(() => {
    if (policyholder && modality) {
      fetchPolicyholderLimit(policyholder.id, modality.id);
    }
  }, [policyholder, modality]);

  const fetchPolicyholderLimit = (
    policyholderId: number,
    modalityId: number,
  ) => {
    QuotationPricingApi.getPolicyholderBalanceLimits(policyholderId, modalityId)
      .then(response => setPolicyholderLimit(response))
      .catch(() =>
        makeToast(
          'error',
          'Ocorreu um erro ao buscar o limite deste tomador para a modalidade selecionada.',
        ),
      );
  };

  const limitText = useMemo(() => {
    if (!policyholderLimit) return 'Carregando...';
    const {
      showFlexibilizationLimit,
      availableLimit,
      availableFlexibilizationLimit,
    } = policyholderLimit;
    const displayLimit = showFlexibilizationLimit
      ? currencyFormatter(availableFlexibilizationLimit)
      : currencyFormatter(availableLimit);
    return `${displayLimit}`;
  }, [policyholderLimit]);

  const handleSecuredAmount = (securedAmount: number) => {
    dispatch(setSecuredAmount(securedAmount));
  };

  return (
    <div className={styles['secured-amount__wrapper']}>
      <h3 className={styles['secured-amount__title']}>{title}</h3>
      <CurrencyInput
        id="securedAmount-input-securedAmount"
        data-testid="securedAmount-input-securedAmount"
        label="Total da cobertura"
        placeholder="R$ 0,00"
        onChange={handleSecuredAmount}
        value={securedAmount}
        helperMessage={`Limite disponível: ${limitText}`}
        errorMessage={errors.securedAmount?.join('. ')}
        onBlur={() => createOrUpdateQuote()}
      />
      {children}
    </div>
  );
};

export default SecuredAmount;

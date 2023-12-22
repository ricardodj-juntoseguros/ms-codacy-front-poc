import { CurrencyInput, Tag, makeToast } from 'junto-design-system';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { currencyFormatter, thousandSeparator } from '@shared/utils';
import {
  selectQuote,
  quoteSliceActions,
} from '../../../application/features/quote/QuoteSlice';
import QuotationPricingApi from '../../../application/features/quotationPricing/QuotationPricingApi';
import { PolicyholderBalanceLimitsDTO } from '../../../application/types/dto';
import { selectValidation } from '../../../application/features/validation/ValidationSlice';
import { useQuotation } from '../../hooks';
import FlexRateToggle from '../FlexRateToggle';
import { QuotationPricingSkeleton } from '../Skeletons';
import styles from './SecuredAmountAndPricing.module.scss';
import FeeCalculation from '../FeeCalculation';

const SecuredAmountAndPricing: React.FC = () => {
  const dispatch = useDispatch();
  const { securedAmount, policyholder, modality, currentQuote, loadingQuote } =
    useSelector(selectQuote);
  const { errors } = useSelector(selectValidation);
  const createOrUpdateQuote = useQuotation();
  const [policyholderLimit, setPolicyholderLimit] =
    useState<PolicyholderBalanceLimitsDTO>();
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

  const renderPricingData = () => {
    if (!currentQuote) return null;
    const {
      totalPrize,
      proposalFee,
      pricing: {
        comissionValue,
        commissionFee,
        feeFlexEnabled,
        feeFlex,
        commissionFlexEnabled,
        commissionFlex,
      },
    } = currentQuote;
    return (
      <>
        <div
          className={classNames(
            styles['secured-amount-pricing__pricing-data-item'],
            styles['secured-amount-pricing__pricing-data-item--large'],
          )}
        >
          <p>Prêmio final</p>
          <p>{currencyFormatter(totalPrize)}</p>
        </div>
        <div className={styles['secured-amount-pricing__pricing-data-item']}>
          <p>Comissão final</p>
          <p>
            {currencyFormatter(comissionValue)}
            <Tag variant="neutral">{commissionFee}%</Tag>
          </p>
        </div>
        <div className={styles['secured-amount-pricing__pricing-data-item']}>
          <p>Taxa padrão</p>
          <p>{thousandSeparator(proposalFee, '.', 2)}%</p>
        </div>
        {feeFlexEnabled && feeFlex && (
          <div className={styles['secured-amount-pricing__pricing-data-item']}>
            <p>Taxa flex</p>
            <p>{thousandSeparator(feeFlex || 0, '.', 2)}%</p>
          </div>
        )}
        {commissionFlexEnabled && commissionFlex && (
          <div className={styles['secured-amount-pricing__pricing-data-item']}>
            <p>Comissão flex</p>
            <p>{currencyFormatter(commissionFlex || 0)}</p>
          </div>
        )}
      </>
    );
  };

  return (
    <div className={styles['secured-amount-pricing__wrapper']}>
      <h3 className={styles['secured-amount-pricing__title']}>
        Valor de cobertura e taxas
      </h3>
      <CurrencyInput
        data-testid="securedAmountAndPricing-input-securedAmount"
        label="Total da cobertura"
        placeholder="R$ 0,00"
        onChange={handleSecuredAmount}
        value={securedAmount}
        helperMessage={`Limite disponível: ${limitText}`}
        errorMessage={errors.securedAmount?.join('. ')}
        onBlur={() => createOrUpdateQuote()}
      />
      {loadingQuote && <QuotationPricingSkeleton />}
      {!loadingQuote && currentQuote?.totalPrize && (
        <div className={styles['secured-amount-pricing__pricing-wrapper']}>
          <FlexRateToggle />
          <FeeCalculation onCalculateCallback={() => createOrUpdateQuote()} />
          <div className={styles['secured-amount-pricing__pricing-data']}>
            {renderPricingData()}
          </div>
        </div>
      )}
    </div>
  );
};

export default SecuredAmountAndPricing;

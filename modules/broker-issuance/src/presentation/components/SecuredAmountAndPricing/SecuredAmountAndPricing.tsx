import {
  Button,
  CurrencyInput,
  NumberInput,
  Tag,
  Toggle,
  makeToast,
} from 'junto-design-system';
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
import { QuotationPricingSkeleton } from '../Skeletons';
import styles from './SecuredAmountAndPricing.module.scss';
import { MAX_STANDARD_FEE } from '../../../constants';

const SecuredAmountAndPricing: React.FC = () => {
  const dispatch = useDispatch();
  const {
    securedAmount,
    policyholder,
    modality,
    currentQuote,
    proposalFee,
    toggleRateFlex,
    loadingQuote,
  } = useSelector(selectQuote);
  const { errors } = useSelector(selectValidation);
  const createOrUpdateQuote = useQuotation();
  const [policyholderLimit, setPolicyholderLimit] =
    useState<PolicyholderBalanceLimitsDTO>();
  const { setToggleRateFlex, setSecuredAmount, setProposalFee } =
    quoteSliceActions;

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

  const calculateButtonDisabled = useMemo(() => {
    return !(currentQuote && proposalFee && proposalFee <= MAX_STANDARD_FEE);
  }, [currentQuote, proposalFee]);

  const handleSecuredAmount = (securedAmount: number) => {
    dispatch(setSecuredAmount(securedAmount));
  };

  const handleChangeProposalFee = (value?: number) => {
    dispatch(setProposalFee(value || NaN));
  };

  const renderRatesData = () => {
    if (!currentQuote) return null;
    const {
      totalPrize,
      pricing: { comissionValue, commissionFee, fee },
    } = currentQuote;
    return (
      <>
        <div
          className={classNames(
            styles['secured-amount-pricing__rate-data-item'],
            styles['secured-amount-pricing__rate-data-item--large'],
          )}
        >
          <p>Prêmio final</p>
          <p>{currencyFormatter(totalPrize)}</p>
        </div>
        <div className={styles['secured-amount-pricing__rate-data-item']}>
          <p>Comissão final</p>
          <p>
            {currencyFormatter(comissionValue)}
            <Tag variant="neutral">{commissionFee}%</Tag>
          </p>
        </div>
        <div className={styles['secured-amount-pricing__rate-data-item']}>
          <p>Taxa padrão</p>
          <p>{thousandSeparator(fee, '.', 2)}%</p>
        </div>
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
      {!loadingQuote && currentQuote && (
        <div className={styles['secured-amount-pricing__rates-wrapper']}>
          <div>
            <Toggle
              name="tgl-flexRate"
              checked={toggleRateFlex || false}
              label="Utilizar taxa flex"
              onChange={() => dispatch(setToggleRateFlex())}
            />
          </div>
          <div className={styles['secured-amount-pricing__rate-inputs']}>
            <NumberInput
              data-testid="securedAmountAndPricing-input-proposalFee"
              allowLeadingZeros
              fixedDecimalScale
              label="Taxa padrão"
              value={proposalFee}
              maxValue={MAX_STANDARD_FEE}
              suffix="%"
              decimalScale={2}
              decimalSeparator=","
              onChange={v => handleChangeProposalFee(v)}
              helperMessage="Taxa padrão máxima de 11,99%"
              errorMessage={errors.proposalFee?.join('. ')}
            />
            <Button
              mobileFullWidth
              data-testid="securedAmountAndPricing-button-calculate"
              variant="secondary"
              disabled={calculateButtonDisabled}
              onClick={() => createOrUpdateQuote()}
            >
              Calcular
            </Button>
          </div>
          <div className={styles['secured-amount-pricing__rate-data']}>
            {renderRatesData()}
          </div>
        </div>
      )}
    </div>
  );
};

export default SecuredAmountAndPricing;

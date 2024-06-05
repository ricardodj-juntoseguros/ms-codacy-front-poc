import { FunctionComponent } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { Tag } from 'junto-design-system';
import { thousandSeparator } from '@shared/utils';
import { BrokerPlatformAuthService, ProfileEnum } from '@services';
import { selectQuote } from '../../../application/features/quote/QuoteSlice';
import { currencyFormatter } from '../../../helpers';
import FlexRateToggle from '../FlexRateToggle';
import FeeCalculation from '../FeeCalculation';
import { QuotationPricingSkeleton } from '../Skeletons';
import styles from './Pricing.module.scss';

const Pricing: FunctionComponent = () => {
  const { currentQuote, loadingQuote } = useSelector(selectQuote);
  const profile = BrokerPlatformAuthService.getUserProfile();

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
            styles['pricing__data-item'],
            styles['pricing__data-item--large'],
          )}
        >
          <p>Prêmio</p>
          <p>{currencyFormatter(totalPrize)}</p>
        </div>
        <div className={styles['pricing__data-item']}>
          <p>Comissão</p>
          <p>
            {currencyFormatter(comissionValue)}
            <Tag variant="neutral">
              {thousandSeparator(commissionFee, '.', 2)?.replace(',00', '')}%
            </Tag>
          </p>
        </div>
        <div className={styles['pricing__data-item']}>
          <p>Taxa padrão</p>
          <p>{thousandSeparator(proposalFee, '.', 2)}%</p>
        </div>
        {feeFlexEnabled && feeFlex && (
          <div className={styles['pricing__data-item']}>
            <p>Taxa flex</p>
            <p>{thousandSeparator(feeFlex || 0, '.', 2)}%</p>
          </div>
        )}
        {commissionFlexEnabled && commissionFlex && (
          <div className={styles['pricing__data-item']}>
            <p>Comissão flex</p>
            <p>{currencyFormatter(commissionFlex || 0)}</p>
          </div>
        )}
      </>
    );
  };

  const renderPricing = () => {
    if (loadingQuote && profile !== ProfileEnum.POLICYHOLDER) {
      return <QuotationPricingSkeleton />;
    }
    if (
      !loadingQuote &&
      currentQuote?.totalPrize &&
      profile !== ProfileEnum.POLICYHOLDER
    ) {
      return (
        <div className={styles['pricing_wrapper']}>
          <FlexRateToggle />
          <FeeCalculation />
          <div className={styles['pricing__data']}>{renderPricingData()}</div>
        </div>
      );
    }
    return null;
  };

  return renderPricing();
};

export default Pricing;

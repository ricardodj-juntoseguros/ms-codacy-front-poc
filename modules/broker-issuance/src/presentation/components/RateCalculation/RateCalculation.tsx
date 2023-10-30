import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NumberInput } from 'junto-design-system';
import { getStepByName } from '../../../helpers';
import {
  selectFlow,
  flowSliceActions,
} from '../../../application/features/flow/FlowSlice';
import {
  selectQuote,
  quoteSliceActions,
} from '../../../application/features/quote/QuoteSlice';
import { RateFlexCalculation } from '../RateFlexCalculation';
import { RateSummary } from '../RateSummary';
import styles from './RateCalculation.module.scss';
import RateFlexApi from '../../../application/features/rateFlex/RateFlexApi';

const stepName = 'RateCalculation';

export const RateCalculation: React.FC = () => {
  const [hasRateFlex, setHasRateFlex] = useState(true);
  const [rateFlexVisible, setRateFlexVisible] = useState(false);
  const dispatch = useDispatch();
  const { pricing, loadingQuote, policyholder, modality } =
    useSelector(selectQuote);
  const { steps } = useSelector(selectFlow);

  useEffect(() => {
    const getRateFlexEnabled = async () => {
      if (policyholder && modality) {
        await RateFlexApi.getRateFlexEnabled(policyholder?.id, modality?.id)
          .then(response => setHasRateFlex(response.flexTax))
          .catch(() => setHasRateFlex(false));
      }
    };

    getRateFlexEnabled();
  }, [policyholder, modality]);

  const stepStatus = useMemo(() => {
    return getStepByName(stepName, steps);
  }, [steps]);

  const stepTitle = useMemo(() => {
    return (
      <title>
        Calcule a <strong>taxa</strong>
      </title>
    );
  }, []);

  const handleChangeProposalFee = (value: number) => {
    dispatch(quoteSliceActions.setProposalFee(value));
  };

  const handleChangeFeeFlex = (value: number) => {
    dispatch(quoteSliceActions.setFeeFlex(value));
  };

  const handleChangeCommissionFlex = (value: number) => {
    dispatch(quoteSliceActions.setCommissionFlex(value));
  };

  const handleChangeRateFlexVisible = () => {
    setRateFlexVisible(!rateFlexVisible);
  };

  const handleDownloadQuote = () => {
    console.log('download');
  };

  const feeFlexEnabled = useMemo(() => {
    const { comissionValue, commissionFlex } = pricing;
    let { totalPrize } = pricing;

    if (commissionFlex !== comissionValue) {
      totalPrize -= commissionFlex;
    }

    return totalPrize >= 1200;
  }, [pricing]);

  return (
    <div>
      {/* <StepContainer
        stepNumber={stepStatus?.number}
        isVisible={stepStatus?.isVisible}
        isEnabled={stepStatus?.isEnabled}
        isLoading={stepStatus?.isLoading || loadingQuote}
        title={stepTitle}
      > */}
      <div
        className={styles['rate-calculation']}
        data-testid="rate-calculation"
      >
        <NumberInput
          data-cy="fee-input"
          label="Taxa Padrão"
          placeholder="Taxa Padrão"
          helperMessage="Taxa máxima 11.99%"
          maxValue={11.99}
          minValue={1}
          suffix=" %"
          allowNegative={false}
          decimalScale={2}
          onChange={handleChangeProposalFee}
          value={pricing.proposalFee}
        />
        {hasRateFlex && (
          <RateFlexCalculation
            maxRate={11.99}
            feeFlexValue={pricing.feeFlex}
            commissionFlexValue={pricing.commissionFlex}
            onChangeFeeFlex={handleChangeFeeFlex}
            onChangeComissionFlex={handleChangeCommissionFlex}
            feeFlexEnabled={feeFlexEnabled}
            rateFlexVisible={rateFlexVisible}
            handleChangeRateFlexVisible={handleChangeRateFlexVisible}
          />
        )}
        <RateSummary
          finalPrize={pricing.totalPrize}
          finalCommission={pricing.comissionValue}
          commissionPercent={pricing.commissionFee}
          handleDownloadQuote={handleDownloadQuote}
        />
      </div>
      {/* </StepContainer> */}
    </div>
  );
};

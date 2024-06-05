import { Toggle, Tooltip } from 'junto-design-system';
import { useRef, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  quoteSliceActions,
  selectQuote,
} from '../../../application/features/quote/QuoteSlice';
import { selectAdditionalCoverage } from '../../../application/features/additionalCoverage/AdditionalCoverageSlice';
import styles from './FlexRateToggle.module.scss';

const FlexRateToggle: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const {
    toggleRateFlex,
    currentQuote,
    proposalFee: inputProposalFee,
  } = useSelector(selectQuote);
  const { labor, rateAggravation } = useSelector(selectAdditionalCoverage);
  const [flexTooltipVisible, setFlexTooltipVisible] = useState<boolean>(false);
  const flexTooltipButtonRef = useRef<HTMLButtonElement>(null);
  const { setToggleRateFlex } = quoteSliceActions;

  const toggleRateFlexDisabled = useMemo(() => {
    if (!currentQuote) return true;
    const {
      pricing: { feeFlexEnabled, commissionFlexEnabled },
      proposalFee,
    } = currentQuote;
    return (
      (!feeFlexEnabled && !commissionFlexEnabled) ||
      inputProposalFee !== proposalFee ||
      (labor && !rateAggravation)
    );
  }, [currentQuote, inputProposalFee, labor, rateAggravation]);

  const getTooltipText = () => {
    if (!currentQuote) return '';
    const {
      pricing: { feeFlexEnabled, commissionFlexEnabled },
      proposalFee,
    } = currentQuote;
    if (
      (!feeFlexEnabled && !commissionFlexEnabled) ||
      (labor && !rateAggravation)
    ) {
      return 'A taxa flex é desabilitada quando não considerado os 50% de agravo na cobertura trabalhista, ou caso não esteja disponível para o tomador.';
    }
    if (inputProposalFee !== proposalFee) {
      return 'A taxa flex está desabilitada pois você deve recalcular sua cotação após a alteração da taxa padrão. Clique em "Calcular" para habilitar novamente.';
    }
    return '';
  };

  return (
    <div className={styles['flex-rate-toggle__wrapper']}>
      <Toggle
        name="tgl-flexRate"
        data-testid="flexRateToggle-toggle-input"
        checked={toggleRateFlex || false}
        disabled={toggleRateFlexDisabled}
        label="Utilizar taxa flex"
        onChange={() => dispatch(setToggleRateFlex())}
      />
      {toggleRateFlexDisabled && (
        <>
          <button
            type="button"
            ref={flexTooltipButtonRef}
            data-testid="flexRateToggle-tooltip-button"
            className={styles['flex-rate-toggle__info-button']}
            onMouseEnter={() => setFlexTooltipVisible(true)}
            onMouseLeave={() => setFlexTooltipVisible(false)}
          >
            <i className="icon-info" />
          </button>
          <Tooltip
            anchorRef={flexTooltipButtonRef}
            text={getTooltipText()}
            visible={flexTooltipVisible}
            position="top"
          />
        </>
      )}
    </div>
  );
};

export default FlexRateToggle;

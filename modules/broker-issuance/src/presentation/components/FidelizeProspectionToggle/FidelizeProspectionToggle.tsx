import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Toggle, Tooltip } from 'junto-design-system';
import { useDispatch, useSelector } from 'react-redux';
import {
  quoteSliceActions,
  selectQuote,
} from '../../../application/features/quote/QuoteSlice';
import { useQuotation } from '../../hooks';
import { DISCLAIMERS } from '../../../constants';
import { selectPolicyRenewal } from '../../../application/features/policyRenewal/PolicyRenewalSlice';
import styles from './FidelizeProspectionToggle.module.scss';

const FidelizeProspectionToggle: FunctionComponent = () => {
  const dispatch = useDispatch();
  const createOrUpdateQuote = useQuotation();
  const tooltipButtonRef = useRef<HTMLButtonElement>(null);
  const {
    policyholder,
    isFidelizeProspection,
    isPolicyInProgress,
    currentQuote,
    hasQuoteChanges,
  } = useSelector(selectQuote);
  const { isPolicyRenewal } = useSelector(selectPolicyRenewal);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const { setIsFidelizeProspection } = quoteSliceActions;
  const shouldDisableToggle = isPolicyInProgress || isPolicyRenewal;

  useEffect(() => {
    if (currentQuote && currentQuote.pricing && hasQuoteChanges) {
      createOrUpdateQuote(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFidelizeProspection, currentQuote]);

  const handleToggleChange = () => {
    dispatch(setIsFidelizeProspection(!isFidelizeProspection));
  };

  if (!policyholder) return null;
  return (
    <div className={styles['fidelize-prospection-toggle__wrapper']}>
      <Toggle
        id="fidelizeProspection-toggle"
        data-testid="fidelizeProspection-toggle"
        name="fidelizeProspection-toggle"
        label="Essa proposta é uma prospecção do Fidelize"
        checked={isFidelizeProspection}
        disabled={shouldDisableToggle}
        onChange={() => handleToggleChange()}
      />
      {!shouldDisableToggle && (
        <>
          <button
            id="fidelizeProspectionToggle-tooltip"
            data-testid="fidelizeProspectionToggle-tooltip"
            ref={tooltipButtonRef}
            type="button"
            className={styles['fidelize-prospection-toggle__tooltip']}
            onMouseEnter={() => setIsTooltipVisible(true)}
            onMouseLeave={() => setIsTooltipVisible(false)}
          >
            <i className="icon-info" />
          </button>
          <Tooltip
            anchorRef={tooltipButtonRef}
            text={DISCLAIMERS.fidelizeProspection}
            visible={isTooltipVisible}
            position="top"
          />
        </>
      )}
    </div>
  );
};

export default FidelizeProspectionToggle;

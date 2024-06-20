import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Toggle, Tooltip } from 'junto-design-system';
import { useDispatch, useSelector } from 'react-redux';
import {
  quoteSliceActions,
  selectQuote,
} from '../../../application/features/quote/QuoteSlice';
import { DISCLAIMERS } from '../../../constants';
import { useQuotation } from '../../hooks';
import styles from './PolicyInProgress.module.scss';

const PolicyInProgress: FunctionComponent = () => {
  const dispatch = useDispatch();
  const createOrUpdateQuote = useQuotation();
  const tooltipButtonRef = useRef<HTMLButtonElement>(null);
  const [policyInProgressTooltipVisible, setPolicyInProgressTooltipVisible] =
    useState(false);
  const {
    policyholder,
    isPolicyInProgress,
    currentQuote,
    hasQuoteChanges,
    isFidelizeProspection,
  } = useSelector(selectQuote);
  const { toggleIsPolicyInProgress } = quoteSliceActions;

  useEffect(() => {
    if (currentQuote && currentQuote.pricing && hasQuoteChanges) {
      createOrUpdateQuote(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPolicyInProgress, currentQuote]);

  const handleToggleIsPolicyInProgress = () => {
    dispatch(toggleIsPolicyInProgress());
  };

  const renderPolicyInProgressToggle = () => {
    if (
      !policyholder ||
      !policyholder.disabledFeatures ||
      policyholder.disabledFeatures.policyInProgress
    ) {
      return null;
    }

    return (
      <div className={styles['policy-in-progress__wrapper']}>
        <Toggle
          id="policyInProgress-toggle"
          data-testid="policyInProgress-toggle"
          name="policyInProgress-toggle"
          label="Essa proposta trata-se de uma apólice em andamento"
          checked={isPolicyInProgress}
          onChange={() => handleToggleIsPolicyInProgress()}
          disabled={isFidelizeProspection}
        />
        {!isFidelizeProspection && (
          <>
            <button
              id="policyInProgress-tooltip"
              data-testid="policyInProgress-tooltip"
              ref={tooltipButtonRef}
              type="button"
              className={styles['policy-in-progress__tooltip']}
              onMouseEnter={() => setPolicyInProgressTooltipVisible(true)}
              onMouseLeave={() => setPolicyInProgressTooltipVisible(false)}
            >
              <i className="icon-info" />
            </button>
            <Tooltip
              anchorRef={tooltipButtonRef}
              text={DISCLAIMERS.policyInProgress}
              visible={policyInProgressTooltipVisible}
              position="top"
            />
          </>
        )}
      </div>
    );
  };

  return renderPolicyInProgressToggle();
};

export default PolicyInProgress;

/* eslint-disable react-hooks/exhaustive-deps */
import { FunctionComponent, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Toggle, Tooltip } from 'junto-design-system';
import { useDebounce } from '@shared/hooks';
import { BrokerPlatformAuthService, ProfileEnum } from '@services';
import {
  quoteSliceActions,
  selectQuote,
} from '../../../application/features/quote/QuoteSlice';
import {
  COVERAGE_LABOR_CONTAINMENT_AND_RESCUE_SUBMODALITY_ID,
  COVERAGE_LABOR_SUBMODALITY_ID,
  DEFAULT_CONTAINMENT_AND_RESCUE_SUBMODALITY_ID,
  DEFAULT_SUBMODALITY_ID,
} from '../../../constants';
import {
  additionalCoverageActions,
  selectAdditionalCoverage,
} from '../../../application/features/additionalCoverage/AdditionalCoverageSlice';
import { useQuotation } from '../../hooks';
import styles from './CoverageLabor.module.scss';

const CoverageLabor: FunctionComponent = () => {
  const dispatch = useDispatch();
  const { labor, rateAggravation } = useSelector(selectAdditionalCoverage);
  const { modality, loadingQuote, toggleRateFlex, currentQuote } =
    useSelector(selectQuote);
  const { setLabor, setRateAggravation } = additionalCoverageActions;
  const {
    setSubmodality,
    setToggleRateFlex,
    setCommissionFlex,
    setFeeFlex,
    setProposalFee,
  } = quoteSliceActions;
  const [showLaborTooltip, setShowLaborTooltip] = useState<boolean>(false);
  const coverageLaborButtonRef = useRef<HTMLButtonElement>(null);
  const createOrUpdateQuote = useQuotation();

  useDebounce(
    () => {
      createOrUpdateQuote();
    },
    250,
    [labor, rateAggravation],
  );

  const handleLaborChange = () => {
    dispatch(setLabor(!labor));
    const submodalityId = !labor
      ? COVERAGE_LABOR_SUBMODALITY_ID
      : DEFAULT_SUBMODALITY_ID;
    const containmentAndRescueSubmodalityId = !labor
      ? COVERAGE_LABOR_CONTAINMENT_AND_RESCUE_SUBMODALITY_ID
      : DEFAULT_CONTAINMENT_AND_RESCUE_SUBMODALITY_ID;
    const coverageLaborSubmodality = modality?.submodalities.find(
      submodality =>
        submodality.id === submodalityId ||
        submodality.id === containmentAndRescueSubmodalityId,
    );
    if (coverageLaborSubmodality) {
      dispatch(setSubmodality(coverageLaborSubmodality));
    }
  };

  const handleRateAggravationChange = () => {
    dispatch(setRateAggravation(!rateAggravation));
    if (toggleRateFlex) dispatch(setToggleRateFlex());
    dispatch(setProposalFee(currentQuote?.pricing.feeStandard || 0));
    dispatch(setCommissionFlex(NaN));
    dispatch(setFeeFlex(NaN));
  };

  const renderRateAggravation = () => {
    const userProfile = BrokerPlatformAuthService.getUserProfile();
    if (!labor || userProfile === ProfileEnum.POLICYHOLDER) return null;
    return (
      <Toggle
        id="coverageLabor-rate-aggravation-toggle"
        data-testid="coverageLabor-rate-aggravation-toggle"
        checked={rateAggravation}
        name="coverageLabor-rate-aggravation-toggle"
        onChange={() => handleRateAggravationChange()}
        label="Considerar 50% de agravo da cobertura?"
        disabled={loadingQuote}
      />
    );
  };

  return (
    <div className={styles['coverage-labor__wrapper']}>
      <div className={styles['coverage-labor__content']}>
        <Toggle
          id="coverageLabor-labor-toggle"
          data-testid="coverageLabor-labor-toggle"
          checked={labor}
          name="coverageLabor-labor-toggle"
          onChange={() => handleLaborChange()}
          label="Emitir com cobertura adicional trabalhista?"
          disabled={loadingQuote}
        />
        <button
          id="coverageLabor-tooltip-button"
          data-testid="coverageLabor-tooltip-button"
          type="button"
          ref={coverageLaborButtonRef}
          className={styles['coverage-labor__info-button']}
          onMouseEnter={() => setShowLaborTooltip(true)}
          onMouseLeave={() => setShowLaborTooltip(false)}
        >
          <i className="icon-info" />
        </button>
        <Tooltip
          anchorRef={coverageLaborButtonRef}
          text="Nessa modalidade é possível contratar uma cobertura adicional para risco Trabalhista e Previdenciário, que garante o pagamento ao segurado de prejuízos referente a ações trabalhistas decorrentes do contrato firmado."
          visible={showLaborTooltip}
          position="top"
        />
      </div>
      {renderRateAggravation()}
    </div>
  );
};

export default CoverageLabor;

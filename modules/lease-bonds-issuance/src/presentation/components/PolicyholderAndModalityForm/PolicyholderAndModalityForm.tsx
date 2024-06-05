import { FunctionComponent, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Dropdown,
  LinkButton,
  Toggle,
  Tooltip,
} from 'junto-design-system';
import Cookies from 'js-cookie';
import { GenericComponentProps, useFlow } from '@shared/hooks';
import { BrokerPlatformAuthService, ProfileEnum } from '@services';
import { DEFAULT_STEP } from '../../../constants/steps';
import { DISCLAIMERS, HELP_ID, REDIRECT_TO_V3_INFOS } from '../../../constants';
import { ModalityModel } from '../../../application/types/model';
import { selectModality } from '../../../application/features/modalitySelection/ModalitySelectionSlice';
import {
  quoteSliceActions,
  selectQuote,
} from '../../../application/features/quote/QuoteSlice';
import PolicyholderAppointmentLetter from '../PolicyholderAppointmentLetter';
import PolicyholderSelection from '../PolicyholderSelection';
import { MODALITY_STEPS } from '../../../constants/steps/modalitySteps';
import { useQuotation } from '../../hooks';
import styles from './PolicyholderAndModalityForm.module.scss';

const PolicyholderAndModalityForm: FunctionComponent<GenericComponentProps> = ({
  name,
}) => {
  const tooltipButtonRef = useRef<HTMLButtonElement>(null);
  const [needAppointmentLetter, setNeedAppointmentLetter] = useState(false);
  const [policyInProgressTooltipVisible, setPolicyInProgressTooltipVisible] =
    useState(false);
  const { advanceStep, setSteps } = useFlow();
  const { modalityOptions, loadingModalities } = useSelector(selectModality);
  const {
    policyholder,
    modality,
    hasQuoteChanges,
    isQuoteResume,
    currentQuote,
    loadingQuote,
    isPolicyInProgress,
  } = useSelector(selectQuote);
  const dispatch = useDispatch();
  const createOrUpdateQuote = useQuotation();
  const { setModality, toggleIsPolicyInProgress } = quoteSliceActions;
  const userProfile = BrokerPlatformAuthService.getUserProfile();

  useEffect(() => {
    if (!modality) return;
    const modalitySteps = MODALITY_STEPS[modality.id];
    if (!modalitySteps) {
      const dateExpire = new Date(new Date().getTime() + 1000 * 60); // in 1 minute
      Cookies.set(
        REDIRECT_TO_V3_INFOS,
        JSON.stringify({
          policyholderFederalId: policyholder?.federalId,
          modalityId: modality?.id,
        }),
        {
          expires: dateExpire,
          domain: `${process.env.NX_GLOBAL_COOKIE_DOMAIN}`,
        },
      );
      const redirectUrl =
        userProfile !== ProfileEnum.POLICYHOLDER
          ? process.env.NX_GLOBAL_MODALITIES_EXPRESS
          : process.env.NX_GLOBAL_MODALITIES_EXPRESS_POLICYHOLDER;
      window.location.href = redirectUrl || '';
    }
    if (modalitySteps) setSteps([...DEFAULT_STEP, ...modalitySteps]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modality]);

  useEffect(() => {
    if (currentQuote && currentQuote.pricing && hasQuoteChanges) {
      createOrUpdateQuote(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPolicyInProgress, currentQuote]);

  const disabledSubmitButton = useMemo(() => {
    return needAppointmentLetter || !policyholder || !modality;
  }, [modality, needAppointmentLetter, policyholder]);

  const isReadonlyFields = useMemo(() => {
    return isQuoteResume || !!currentQuote;
  }, [isQuoteResume, currentQuote]);

  const handleModalitySelected = (optionSelected: ModalityModel) => {
    dispatch(setModality(optionSelected));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (loadingQuote) return;
    advanceStep(name);
  };

  const handleRedirectModalityHelp = () => {
    const dateExpire = new Date(new Date().getTime() + 1000 * 60); // in 1 minute
    Cookies.set(HELP_ID, 'modalidades', {
      expires: dateExpire,
      domain: `${process.env.NX_GLOBAL_COOKIE_DOMAIN}`,
    });
    window.open(`${process.env.NX_GLOBAL_BROKER_HELP_URL}`, '_blank');
  };

  const renderSelectModality = () => {
    return (
      <div
        className={styles['policyholder-and-modality-form__modality-wrapper']}
      >
        <Dropdown
          id="policyholderAndModality-modality-input-dropdown"
          data-testid="policyholderAndModality-modality-input-dropdown"
          label="Selecione a modalidade"
          placeholder="Selecione uma opção"
          options={modalityOptions}
          value={modality}
          onValueSelected={handleModalitySelected}
          disabled={modalityOptions.length === 0}
          loading={loadingModalities}
          readOnly={isReadonlyFields}
        />
        {modalityOptions.length !== 0 && userProfile === ProfileEnum.BROKER && (
          <LinkButton
            label="Sobre as modalidades"
            onClick={() => handleRedirectModalityHelp()}
          />
        )}
      </div>
    );
  };

  const renderPolicyInProgressToggle = () => {
    if (
      !policyholder ||
      !policyholder.disabledFeatures ||
      policyholder.disabledFeatures.policyInProgress
    )
      return null;
    return (
      <div
        className={styles['policyholder-and-modality-form__policy-in-progress']}
      >
        <Toggle
          data-testid="policyholderAndModalityForm-in-progress-toggle"
          name="tgl-policy-in-progress"
          label="Essa proposta trata-se de uma apólice em andamento"
          checked={isPolicyInProgress}
          onChange={() => dispatch(toggleIsPolicyInProgress())}
        />
        <button
          ref={tooltipButtonRef}
          data-testid="policyholderAndModalityForm-in-progress-tooltip"
          type="button"
          className={
            styles['policyholder-and-modality-form__policy-in-progress-tooltip']
          }
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
      </div>
    );
  };

  return (
    <form
      id="policyholderAndModality-form"
      data-testid="policyholderAndModality-form"
      className={styles['policyholder-and-modality-form__wrapper']}
      onSubmit={e => handleSubmit(e)}
    >
      <PolicyholderSelection
        userProfile={userProfile}
        readonlyFields={isReadonlyFields}
        needAppointmentLetter={needAppointmentLetter}
        setNeedAppointmentLetter={setNeedAppointmentLetter}
      />
      {needAppointmentLetter ? (
        <PolicyholderAppointmentLetter />
      ) : (
        <>
          {/* {renderSelectModality()} */}
          {renderPolicyInProgressToggle()}
          <Button
            id="policyholderAndModality-submit-button"
            data-testid="policyholderAndModality-submit-button"
            type="submit"
            disabled={disabledSubmitButton}
            loading={loadingQuote}
          >
            Continuar
          </Button>
        </>
      )}
    </form>
  );
};

export default PolicyholderAndModalityForm;

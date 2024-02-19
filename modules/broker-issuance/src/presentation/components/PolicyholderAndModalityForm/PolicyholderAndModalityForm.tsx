import { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Dropdown, LinkButton } from 'junto-design-system';
import Cookies from 'js-cookie';
import { GenericComponentProps, useFlow } from '@shared/hooks';
import { BrokerPlatformAuthService, ProfileEnum } from '@services';
import { HELP_ID, REDIRECT_TO_V3_INFOS } from '../../../constants';
import { ModalityModel } from '../../../application/types/model';
import { selectModality } from '../../../application/features/modalitySelection/ModalitySelectionSlice';
import {
  quoteSliceActions,
  selectQuote,
} from '../../../application/features/quote/QuoteSlice';
import PolicyholderAppointmentLetter from '../PolicyholderAppointmentLetter';
import PolicyholderSelection from '../PolicyholderSelection';
import { MODALITY_STEPS } from '../../../constants/steps/modalitySteps';
import styles from './PolicyholderAndModalityForm.module.scss';

const PolicyholderAndModalityForm: FunctionComponent<GenericComponentProps> = ({
  name,
}) => {
  const [needAppointmentLetter, setNeedAppointmentLetter] = useState(false);
  const { advanceStep, setSteps, steps } = useFlow();
  const { modalityOptions, loadingModalities } = useSelector(selectModality);
  const { policyholder, modality, isQuoteResume, currentQuote, loadingQuote } =
    useSelector(selectQuote);
  const dispatch = useDispatch();
  const { setModality } = quoteSliceActions;
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
    if (modalitySteps && steps.length === 1) {
      setSteps(modalitySteps);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modality, steps]);

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
          {renderSelectModality()}
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

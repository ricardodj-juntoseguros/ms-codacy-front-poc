import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Dropdown,
  LinkButton,
  UploadFile,
  makeToast,
} from 'junto-design-system';
import { GenericComponentProps, useFlow } from '@shared/hooks';
import { BrokerPlatformAuthService, ProfileEnum } from '@services';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';
import { HELP_ID, REDIRECT_TO_V3_INFOS } from '../../../constants';
import {
  policyholderSelectionActions,
  selectPolicyholder,
} from '../../../application/features/policyholderSelection/PolicyholderSelectionSlice';
import handleError from '../../../helpers/handlerError';
import { ModalityModel } from '../../../application/types/model';
import { selectModality } from '../../../application/features/modalitySelection/ModalitySelectionSlice';
import PolicyholderSelectionApi from '../../../application/features/policyholderSelection/PolicyholderSelectionApi';
import {
  quoteSliceActions,
  selectQuote,
} from '../../../application/features/quote/QuoteSlice';
import PolicyholderAppointmentLetter from '../PolicyholderAppointmentLetter';
import PolicyholderSelection from '../PolicyholderSelection';
import styles from './PolicyholderAndModalityForm.module.scss';
import { MODALITY_STEPS } from '../../../constants/steps/modalitySteps';

const PolicyholderAndModalityForm: FunctionComponent<GenericComponentProps> = ({
  name,
}) => {
  const [needAppointmentLetter, setNeedAppointmentLetter] = useState(false);
  const [appointmentLetter, setAppointmentLetter] = useState<UploadFile[]>([]);
  const [uploadAppointmentLetterLoading, setUploadAppointmentLetterLoading] =
    useState(false);
  const { advanceStep, setSteps, steps } = useFlow();
  const { modalityOptions, loadingModalities } = useSelector(selectModality);
  const { policyholder, modality, isQuoteResume, currentQuote, loadingQuote } =
    useSelector(selectQuote);
  const { policyholderSearchValue } = useSelector(selectPolicyholder);
  const dispatch = useDispatch();
  const history = useHistory();
  const { clearPolicyholderSelection, setCurrentAppointmentLetter } =
    policyholderSelectionActions;
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
      window.location.href = process.env.NX_GLOBAL_MODALITIES_EXPRESS || '';
    }
    if (modalitySteps && steps.length === 1) {
      setSteps(modalitySteps);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modality, steps]);

  const disabledSubmitButton = useMemo(() => {
    if (needAppointmentLetter) {
      return appointmentLetter.length === 0;
    }
    return !policyholder || !modality;
  }, [appointmentLetter, modality, needAppointmentLetter, policyholder]);

  const isReadonlyFields = useMemo(() => {
    return isQuoteResume || !!currentQuote;
  }, [isQuoteResume, currentQuote]);

  const handleUploadFile = (files: UploadFile[]) => {
    setAppointmentLetter(files);
    const { file } = files[0];
    dispatch(
      setCurrentAppointmentLetter({
        filename: file.name,
        size: file.size,
      }),
    );
  };

  const handleRemoveFile = (id: string) => {
    setAppointmentLetter(prev => prev.filter(item => item.id !== id));
    dispatch(setCurrentAppointmentLetter(null));
  };

  const handleModalitySelected = (optionSelected: ModalityModel) => {
    dispatch(setModality(optionSelected));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (loadingQuote) return;
    if (needAppointmentLetter && appointmentLetter.length !== 0) {
      handleUploadAppointmentLetter();
      return;
    }
    advanceStep(name);
  };

  const handleUploadAppointmentLetter = useCallback(async () => {
    const broker = BrokerPlatformAuthService.getBroker();
    if (!broker || !broker.externalId) {
      return;
    }

    setUploadAppointmentLetterLoading(true);
    await PolicyholderSelectionApi.postAppointmentLetter(
      policyholderSearchValue.replace(/[^\d]/g, ''),
      broker.externalId,
      appointmentLetter[0].file,
    )
      .then(() => {
        dispatch(clearPolicyholderSelection());
        history.push('/appointment-sent');
      })
      .catch(error => {
        const message = handleError(error);
        makeToast('error', message);
      })
      .finally(() => setUploadAppointmentLetterLoading(false));
  }, [
    appointmentLetter,
    clearPolicyholderSelection,
    dispatch,
    history,
    policyholderSearchValue,
  ]);

  const handleRedirectModalityHelp = () => {
    const dateExpire = new Date(new Date().getTime() + 1000 * 60); // in 1 minute
    Cookies.set(HELP_ID, 'modalidades', {
      expires: dateExpire,
      domain: `${process.env.NX_GLOBAL_COOKIE_DOMAIN}`,
    });
    window.open(`${process.env.NX_GLOBAL_BROKER_HELP_URL}`, '_blank');
  };

  const renderAppointmentLetter = () => {
    if (!needAppointmentLetter) return null;
    return (
      <PolicyholderAppointmentLetter
        file={appointmentLetter}
        onUploadFile={handleUploadFile}
        onRemoveFile={handleRemoveFile}
      />
    );
  };

  const renderSelectModality = () => {
    if (needAppointmentLetter) return null;
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
        readonlyFields={isReadonlyFields}
        needAppointmentLetter={needAppointmentLetter}
        setNeedAppointmentLetter={setNeedAppointmentLetter}
      />
      {renderAppointmentLetter()}
      {renderSelectModality()}
      <Button
        id="policyholderAndModality-submit-button"
        data-testid="policyholderAndModality-submit-button"
        type="submit"
        disabled={disabledSubmitButton}
        loading={uploadAppointmentLetterLoading || loadingQuote}
      >
        Continuar
      </Button>
    </form>
  );
};

export default PolicyholderAndModalityForm;

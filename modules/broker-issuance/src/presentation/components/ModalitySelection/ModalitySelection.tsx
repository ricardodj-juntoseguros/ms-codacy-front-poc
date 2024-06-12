import { FunctionComponent, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { Dropdown, LinkButton } from 'junto-design-system';
import { BrokerPlatformAuthService, ProfileEnum } from '@services';
import { useFlow } from '@shared/hooks';
import { MODALITY_STEPS } from '../../../constants/steps/modalitySteps';
import { DEFAULT_STEP } from '../../../constants/steps';
import { HELP_ID, REDIRECT_TO_V3_INFOS } from '../../../constants';
import {
  fetchModalities,
  selectModality,
} from '../../../application/features/modalitySelection/ModalitySelectionSlice';
import { ModalityModel } from '../../../application/types/model';
import {
  quoteSliceActions,
  selectQuote,
} from '../../../application/features/quote/QuoteSlice';
import styles from './ModalitySelection.module.scss';

const ModalitySelection: FunctionComponent = () => {
  const dispatch = useDispatch();
  const { setSteps } = useFlow();
  const { modalityOptions, loadingModalities } = useSelector(selectModality);
  const { policyholder, modality, isQuoteResume, currentQuote } =
    useSelector(selectQuote);
  const { setModality } = quoteSliceActions;
  const userProfile = BrokerPlatformAuthService.getUserProfile();

  const isReadonlyFields = useMemo(() => {
    return isQuoteResume || !!currentQuote;
  }, [isQuoteResume, currentQuote]);

  useEffect(() => {
    const broker = BrokerPlatformAuthService.getBroker();
    if (!broker || !broker.externalId || !policyholder) return;
    const fetchModalitiesParams = {
      brokerFederalId: broker.federalId,
      policyholderFederalId: policyholder.federalId,
    };
    dispatch(fetchModalities(fetchModalitiesParams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policyholder]);

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

  const handleRedirectModalityHelp = () => {
    const dateExpire = new Date(new Date().getTime() + 1000 * 60); // in 1 minute
    Cookies.set(HELP_ID, 'modalidades', {
      expires: dateExpire,
      domain: `${process.env.NX_GLOBAL_COOKIE_DOMAIN}`,
    });
    window.open(`${process.env.NX_GLOBAL_BROKER_HELP_URL}`, '_blank');
  };

  const handleModalitySelected = (optionSelected: ModalityModel) => {
    dispatch(setModality(optionSelected));
  };

  return (
    <div className={styles['modality-selection__wrapper']}>
      <Dropdown
        id="modalitySelection-input-dropdown"
        data-testid="modalitySelection-input-dropdown"
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
          id="modalitySelection-link-button-about"
          data-testid="modalitySelection-link-button-about"
          label="Sobre as modalidades"
          onClick={() => handleRedirectModalityHelp()}
        />
      )}
    </div>
  );
};

export default ModalitySelection;

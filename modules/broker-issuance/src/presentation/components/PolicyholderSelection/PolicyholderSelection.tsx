import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Alert,
  Dropdown,
  LinkButton,
  SearchInput,
  SearchOptions,
  makeToast,
} from 'junto-design-system';
import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from '@shared/hooks';
import { BrokerPlatformAuthService } from '@services';
import PolicyholderSelectionApi from '../../../application/features/policyholderSelection/PolicyholderSelectionApi';
import handleError from '../../../helpers/handlerError';
import {
  quoteSliceActions,
  selectQuote,
} from '../../../application/features/quote/QuoteSlice';
import { PolicyholderAffiliatesModel } from '../../../application/types/model/PolicyholderAffiliatesModel';
import { AFFILIATE_DEFAULT_OPTIONS } from '../../../constants';
import { checkValidFederalId } from '../../../helpers';
import {
  policyholderSelectionActions,
  searchPolicyholder,
  selectPolicyholder,
} from '../../../application/features/policyholderSelection/PolicyholderSelectionSlice';
import {
  fetchModalities,
  modalitySelectionActions,
} from '../../../application/features/modalitySelection/ModalitySelectionSlice';
import styles from './PolicyholderSelection.module.scss';

export interface PolicyholderSelectionProps {
  needAppointmentLetter: boolean;
  setNeedAppointmentLetter: (value: boolean) => void;
}

const PolicyholderSelection: FunctionComponent<PolicyholderSelectionProps> = ({
  needAppointmentLetter,
  setNeedAppointmentLetter,
}) => {
  const [showEmptyOptions, setShowEmptyOptions] = useState(false);
  const [loadingPolicyholderDetails, setLoadingPolicyholderDetails] =
    useState(false);
  const dispatch = useDispatch();
  const {
    policyholderOptions,
    policyholderSearchValue,
    affiliatesOptions,
    loadingSearchPolicyholder,
    isValidFederalId,
  } = useSelector(selectPolicyholder);
  const { policyholderAffiliate, policyholder } = useSelector(selectQuote);
  const { setPolicyholderSearchValue, setPolicyholderAffiliatesOptions } =
    policyholderSelectionActions;
  const { resetModalitySelection } = modalitySelectionActions;
  const { setPolicyholder, setPolicyholderAffiliate } = quoteSliceActions;

  useDebounce(
    () => {
      if (
        policyholderSearchValue.length >= 3 &&
        !loadingSearchPolicyholder &&
        !loadingPolicyholderDetails &&
        needAppointmentLetter === false
      ) {
        setShowEmptyOptions(true);
        return;
      }
      setShowEmptyOptions(false);
    },
    1350,
    [
      policyholderSearchValue,
      loadingSearchPolicyholder,
      loadingPolicyholderDetails,
      needAppointmentLetter,
    ],
  );

  useDebounce(
    () => {
      if (policyholderSearchValue.length >= 3 && !isCurrentValueFromOptions) {
        setNeedAppointmentLetter(false);
        dispatch(searchPolicyholder(policyholderSearchValue));
      }
    },
    1000,
    [policyholderSearchValue],
  );

  useEffect(() => {
    if (isValidFederalId) {
      const option = policyholderOptions[0];
      handlePolicyholderSelected({
        ...option,
        label: option ? option.label : policyholderSearchValue,
        value: option ? option.value : policyholderSearchValue,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValidFederalId]);

  const isCurrentValueFromOptions = useMemo(() => {
    return !!policyholderOptions.find(
      opt => opt.label === policyholderSearchValue,
    );
  }, [policyholderOptions, policyholderSearchValue]);

  const getPolicyholderDetails = useCallback(
    (brokerExternalId: number, federalId: string) => {
      setLoadingPolicyholderDetails(true);
      setNeedAppointmentLetter(false);
      const searchValue = checkValidFederalId(federalId)
        ? federalId.toString().replace(/[^\d]/g, '')
        : federalId;
      return PolicyholderSelectionApi.getPolicyholderDetails(
        brokerExternalId,
        searchValue,
      )
        .then(response => response)
        .catch(error => {
          const message = handleError(error);
          if (message.indexOf('empresa está vinculada a outro corretor') > 0) {
            setNeedAppointmentLetter(true);
            return;
          }
          makeToast('error', 'Houve um erro ao buscar os dados do tomador');
        })
        .finally(() => setLoadingPolicyholderDetails(false));
    },
    [setNeedAppointmentLetter],
  );

  const handleSearchPolicyholder = (search: string) => {
    let value = search;
    if (checkValidFederalId(search)) {
      value = search.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        '$1.$2.$3/$4-$5',
      );
    }
    dispatch(setPolicyholderSearchValue(value));
  };

  const handlePolicyholderSelected = async (optionSelected: SearchOptions) => {
    const { value } = optionSelected;
    dispatch(setPolicyholderAffiliatesOptions([]));
    dispatch(resetModalitySelection());
    const broker = BrokerPlatformAuthService.getBroker();
    if (!broker || !broker.externalId) {
      return;
    }
    const policyholderDetails = await getPolicyholderDetails(
      broker.externalId,
      value,
    );
    if (policyholderDetails) {
      const { affiliates, registrationData } = policyholderDetails;
      const fetchModalitiesParams = {
        brokerFederalId: broker.federalId,
        policyholderFederalId: value,
      };
      dispatch(setPolicyholderAffiliatesOptions(affiliates));
      dispatch(setPolicyholder(registrationData));
      dispatch(fetchModalities(fetchModalitiesParams));
    }
  };

  const handlePolicyholderAffiliateSelected = (
    optionSelected: PolicyholderAffiliatesModel,
  ) => {
    dispatch(setPolicyholderAffiliate(optionSelected));
  };

  const renderAffiliateSelection = () => {
    if (affiliatesOptions.length === 0) return null;
    return (
      <Dropdown
        id="policyholderAndModality-input-dropdown"
        data-testid="policyholderAndModality-input-dropdown"
        label="Selecione a filial (opcional)"
        placeholder="Selecione uma opção"
        options={affiliatesOptions}
        value={policyholderAffiliate}
        onValueSelected={handlePolicyholderAffiliateSelected}
        disabled={affiliatesOptions.length === 0}
        loading={loadingPolicyholderDetails}
      />
    );
  };

  const renderNotFoundAffiliateAlert = () => {
    const { label } = AFFILIATE_DEFAULT_OPTIONS.notFoundAffiliate;
    if (policyholderAffiliate?.label === label) {
      return (
        <Alert
          data-testid="policyholderSelection-not-found-affiliate-alert"
          variant="neutral"
          arrow="top-start"
          text="Seguiremos sua proposta com os dados da Matriz. Caso necessite cadastrar uma nova filial, entre em contato %ACTION_BUTTON%"
          actionButtonText="via chat."
          onActionButtonClick={() => alert('vai abrir o chat quando tiver')}
        />
      );
    }
    return null;
  };

  const renderPolicyholderDetailsLink = () => {
    if (
      !policyholder ||
      !BrokerPlatformAuthService.isBroker() ||
      needAppointmentLetter
    )
      return null;
    return (
      <LinkButton
        id="policyholderSelection-link-button-policyholder-details"
        data-testid="policyholderSelection-link-button-policyholder-details"
        label="Ver detalhes deste tomador"
        onClick={() =>
          window.open(
            `${process.env.NX_GLOBAL_POLICYHOLDER_URL}/details/${policyholder.federalId}`,
          )
        }
      />
    );
  };

  return (
    <div className={styles['policyholder-selection__wrapper']}>
      <div className={styles['policyholder-selection__input']}>
        <SearchInput
          id="policyholderSelection-input-search"
          data-testid="policyholderSelection-input-search"
          label="CNPJ ou Razão Social"
          placeholder="Pesquise o tomador pelo CNPJ ou Razão Social"
          onChange={handleSearchPolicyholder}
          changeValueOnSelect
          value={policyholderSearchValue}
          options={policyholderOptions}
          onValueSelected={handlePolicyholderSelected}
          emptyMessage="Tomador não encontrado..."
          showEmptyOptions={showEmptyOptions}
          loading={loadingSearchPolicyholder || loadingPolicyholderDetails}
          autoComplete="off"
        />
        {renderPolicyholderDetailsLink()}
      </div>
      {renderAffiliateSelection()}
      {renderNotFoundAffiliateAlert()}
    </div>
  );
};

export default PolicyholderSelection;

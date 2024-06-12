import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  LinkButton,
  SearchInput,
  SearchOptions,
  makeToast,
} from 'junto-design-system';
import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from '@shared/hooks';
import { BrokerPlatformAuthService, ProfileEnum } from '@services';
import { federalIdValidator } from '@shared/utils';
import PolicyholderSelectionApi from '../../../application/features/policyholderSelection/PolicyholderSelectionApi';
import handleError from '../../../helpers/handlerError';
import {
  quoteSliceActions,
  selectQuote,
} from '../../../application/features/quote/QuoteSlice';
import {
  PolicyholderModel,
  PolicyholderSearchModel,
} from '../../../application/types/model';
import { AppDispatch } from '../../../config/store';
import {
  policyholderSelectionActions,
  searchPolicyholder,
  selectPolicyholder,
} from '../../../application/features/policyholderSelection/PolicyholderSelectionSlice';
import { modalitySelectionActions } from '../../../application/features/modalitySelection/ModalitySelectionSlice';
import styles from './PolicyholderSelection.module.scss';
import PolicyholderAffiliateSelection from '../PolicyholderAffiliateSelection';

const PolicyholderSelection: FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    policyholderOptions,
    policyholderSearchValue,
    affiliatesOptions,
    loadingSearchPolicyholder,
    isValidFederalId,
    needAppointmentLetter,
  } = useSelector(selectPolicyholder);
  const { policyholder, currentQuote, isQuoteResume } =
    useSelector(selectQuote);
  const [showEmptyOptions, setShowEmptyOptions] = useState(false);
  const [loadingPolicyholderDetails, setLoadingPolicyholderDetails] =
    useState(false);
  const {
    setPolicyholderSearchValue,
    setPolicyholderAffiliatesOptions,
    setNeedAppointmentLetter,
  } = policyholderSelectionActions;
  const { resetModalitySelection } = modalitySelectionActions;
  const { setPolicyholder } = quoteSliceActions;
  const userProfile = BrokerPlatformAuthService.getUserProfile();

  useDebounce(
    () => {
      if (
        userProfile === ProfileEnum.POLICYHOLDER ||
        (policyholderSearchValue.length >= 3 &&
          !loadingSearchPolicyholder &&
          !loadingPolicyholderDetails &&
          needAppointmentLetter === false)
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
      if (
        userProfile !== ProfileEnum.POLICYHOLDER &&
        policyholderSearchValue.length >= 3 &&
        !isCurrentValueFromOptions
      ) {
        dispatch(setNeedAppointmentLetter(false));
        dispatch(searchPolicyholder(policyholderSearchValue));
      }
    },
    1000,
    [policyholderSearchValue],
  );

  useEffect(() => {
    if (userProfile === ProfileEnum.POLICYHOLDER && !isQuoteResume) {
      dispatch(searchPolicyholder()).then(response => {
        const payload = response.payload as PolicyholderSearchModel[];
        if (payload.length === 1) {
          const policyholderToSet = payload[0];
          handlePolicyholderSelected(policyholderToSet);
          dispatch(
            setPolicyholderSearchValue({
              value: policyholderToSet.label,
              profile: userProfile,
            }),
          );
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile, dispatch, isQuoteResume]);

  useEffect(() => {
    if (isValidFederalId) {
      const option = policyholderOptions.find(
        p =>
          p.label === policyholderSearchValue ||
          p.federalId === policyholderSearchValue.replace(/[^\d]+/g, ''),
      );
      handlePolicyholderSelected({
        ...option,
        label: option ? option.label : policyholderSearchValue,
        value: option ? option.value : policyholderSearchValue,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValidFederalId, userProfile]);

  const isCurrentValueFromOptions = useMemo(() => {
    return !!policyholderOptions.find(
      opt => opt.label === policyholderSearchValue,
    );
  }, [policyholderOptions, policyholderSearchValue]);

  const filteredPolicyholderOptions = useMemo(() => {
    if (userProfile !== ProfileEnum.POLICYHOLDER || !policyholderSearchValue)
      return null;
    const aux = policyholderOptions.filter(({ label }) =>
      label.toLowerCase().includes(policyholderSearchValue.toLowerCase()),
    );
    return aux;
  }, [policyholderOptions, policyholderSearchValue, userProfile]);

  const isSearchReadonly = useMemo(() => {
    return (
      (userProfile === ProfileEnum.POLICYHOLDER &&
        policyholderOptions.length === 1) ||
      isQuoteResume ||
      !!currentQuote
    );
  }, [userProfile, policyholderOptions, isQuoteResume, currentQuote]);

  const getPolicyholderDetails = useCallback(
    (brokerExternalId: number, federalId: string) => {
      setLoadingPolicyholderDetails(true);
      dispatch(setNeedAppointmentLetter(false));
      const searchValue = federalIdValidator(federalId, 'full')
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
            dispatch(setNeedAppointmentLetter(true));
            dispatch(setPolicyholder({ federalId } as PolicyholderModel));
            return;
          }
          makeToast('error', 'Houve um erro ao buscar os dados do tomador');
        })
        .finally(() => setLoadingPolicyholderDetails(false));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleSearchPolicyholder = (search: string) => {
    let value = search;
    if (federalIdValidator(search, 'full')) {
      value = search.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        '$1.$2.$3/$4-$5',
      );
    }
    dispatch(setPolicyholderSearchValue({ value, profile: userProfile }));
  };

  const handlePolicyholderSelected = async (optionSelected: SearchOptions) => {
    if (!optionSelected) return;
    const { value } = optionSelected;
    if (value === policyholder?.federalId) return;
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
      dispatch(setPolicyholderAffiliatesOptions(affiliates));
      dispatch(setPolicyholder(registrationData));
    }
  };

  const renderPolicyholderDetailsLink = () => {
    if (
      !policyholder ||
      userProfile !== ProfileEnum.BROKER ||
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
          options={filteredPolicyholderOptions || policyholderOptions}
          onValueSelected={handlePolicyholderSelected}
          emptyMessage="Tomador não encontrado..."
          showEmptyOptions={showEmptyOptions}
          loading={loadingSearchPolicyholder || loadingPolicyholderDetails}
          autoComplete="off"
          readOnly={isSearchReadonly}
        />
        {renderPolicyholderDetailsLink()}
      </div>
      {affiliatesOptions.length !== 0 && (
        <PolicyholderAffiliateSelection
          loadingPolicyholderDetails={loadingPolicyholderDetails}
        />
      )}
    </div>
  );
};

export default PolicyholderSelection;

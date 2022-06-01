import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Dropdown, LinkButton, SearchInput } from 'junto-design-system';
import { StepContainer } from '@shared/ui';
import { useOptionsMapper } from '@shared/hooks';
import { BrokerPlatformAuthService } from '@services';
import { validationActions } from '../../../application/features/validation/ValidationSlice';
import { useAppDispatch } from '../../../config/store';
import {
  getModalityByPolicyHolder,
  selectModality,
} from '../../../application/features/modalitySelection/ModalitySelectionSlice';
import { getStepByName } from '../../../helpers';
import {
  getSubsidiaryByPolicyHolderId,
  searchPolicyholder,
  selectPolicyholder,
} from '../../../application/features/policyholderSelection/PolicyholderSelectionSlice';
import {
  selectQuote,
  quoteSliceActions,
} from '../../../application/features/quote/QuoteSlice';
import {
  selectFlow,
  flowSliceActions,
} from '../../../application/features/flow/FlowSlice';
import {
  ModalityModel,
  PolicyholderModel,
  SubsidiaryModel,
} from '../../../application/types/model';
import PolicyholderSelectionApi from '../../../application/features/policyholderSelection/PolicyholderSelectionApi';
import { policyholderDetailsAdapter } from '../../../application/features/policyholderSelection/adapters';
import styles from './Search.module.scss';

const stepName = 'Search';

export const Search: React.FC = () => {
  const [policyholderInput, setPolicyholderInput] = useState('');

  const dispatch = useAppDispatch();
  const { steps } = useSelector(selectFlow);
  const { modalityOptions, loadingGetModalities } = useSelector(selectModality);
  const { policyholderOptions, loadingSearchPolicyholder, subsidiaryOptions } =
    useSelector(selectPolicyholder);
  const { policyholder, modality, subsidiary, loadingQuote } =
    useSelector(selectQuote);

  const getPolicyholderDetails = useCallback(
    (brokerExternalId: number, federalId: string) => {
      return PolicyholderSelectionApi.getPolicyholderDetails(
        brokerExternalId,
        federalId,
      )
        .then(response => policyholderDetailsAdapter(response))
        .catch(error => {
          console.log(error);
          return null;
        })
        .finally();
    },
    [],
  );

  const handleChangePolicyholderInput = (value: string) => {
    setPolicyholderInput(value);
    if (value !== '') dispatch(searchPolicyholder(value));
  };

  const handlePolicyholderSelection = async (
    data: PolicyholderModel,
    label: string,
  ) => {
    setPolicyholderInput(label);
    const { federalId } = data;

    const broker = BrokerPlatformAuthService.getBroker();
    if (!broker || !broker.externalId) {
      return;
    }

    const policyolderDetails = await getPolicyholderDetails(
      broker.externalId,
      federalId,
    );

    if (policyolderDetails) {
      dispatch(quoteSliceActions.resetQuote());
      dispatch(validationActions.clearErrorMessages());
      dispatch(quoteSliceActions.setPolicyholder(policyolderDetails));
      await dispatch(getModalityByPolicyHolder(policyolderDetails.externalId));
      await dispatch(getSubsidiaryByPolicyHolderId(policyolderDetails.id));
    }
  };

  const handleModalitySelection = (data: ModalityModel) => {
    dispatch(quoteSliceActions.setModality(data));
  };

  const handleSubsidiarySelection = (data: SubsidiaryModel) => {
    dispatch(quoteSliceActions.setSubsidiary(data));
  };

  const {
    mappedOptions: mappedPolicyholders,
    selectOption: setPolicyholderOption,
  } = useOptionsMapper(
    policyholderOptions,
    'companyName',
    'federalId',
    'id',
    handlePolicyholderSelection,
  );
  const {
    mappedOptions: mappedSubsidiaries,
    selectOption: setSubsidiaryOption,
  } = useOptionsMapper(
    subsidiaryOptions,
    'label',
    '',
    'id',
    handleSubsidiarySelection,
  );
  const { mappedOptions: mappedModalities, selectOption: setModalityOption } =
    useOptionsMapper(
      modalityOptions,
      'externalDescription',
      '',
      'id',
      handleModalitySelection,
    );

  const stepStatus = useMemo(() => {
    return getStepByName(stepName, steps);
  }, [steps]);

  const currentSubsidiary = useMemo(() => {
    return mappedSubsidiaries.find(item => item.id === subsidiary?.id) || null;
  }, [mappedSubsidiaries, subsidiary]);

  const currentModality = useMemo(() => {
    return mappedModalities.find(item => item.id === modality?.id) || null;
  }, [mappedModalities, modality]);

  const hasValidPolicyholder = useMemo(() => {
    return (
      !!policyholder && !loadingSearchPolicyholder && !loadingGetModalities
    );
  }, [policyholder, loadingSearchPolicyholder, loadingGetModalities]);

  const stepTitle = useMemo(() => {
    return (
      <title>
        Digite o <strong>CNPJ</strong> ou a <strong>razão social </strong>
        do tomador e selecione a <strong>modalidade</strong> do seguro
      </title>
    );
  }, []);

  const policyholderDetails = useMemo(() => {
    if (!policyholder && !loadingSearchPolicyholder) return null;

    return (
      <LinkButton
        data-testid="policyholder-details-link-button"
        label="Ver detalhes deste tomador"
        size="small"
        onClick={() =>
          window.open(
            `${process.env.NX_GLOBAL_TOMADOR_WEB}details/${policyholder?.federalId}`,
            '_blank',
          )
        }
      />
    );
  }, [policyholder, loadingSearchPolicyholder]);

  const policyholderSubidiariesOptions = useMemo(() => {
    if (subsidiaryOptions.length === 0) return null;

    return (
      <div className={styles['search__subsidiary-wrapper']}>
        <Dropdown
          data-testid="policyholder-dropdown-subsidiary"
          placeholder="Selecione a filial"
          label="Selecione a filial"
          options={mappedSubsidiaries}
          onValueSelected={setSubsidiaryOption}
          value={currentSubsidiary}
        />
      </div>
    );
  }, [
    mappedSubsidiaries,
    setSubsidiaryOption,
    currentSubsidiary,
    subsidiaryOptions,
  ]);

  useEffect(() => {
    if (policyholder && modality && stepStatus) {
      dispatch(flowSliceActions.advanceStep({ name: stepName }));
      dispatch(
        flowSliceActions.setStepStatus({
          name: stepStatus.nextStep,
          isEnabled: true,
          isLoading: false,
          isVisible: true,
        }),
      );
    }
  }, [dispatch, modality, policyholder, stepStatus]);

  return (
    <StepContainer
      stepNumber={stepStatus?.number}
      title={stepTitle}
      isEnabled
      isLoading={loadingQuote}
    >
      <form className={styles['search']} data-testid="search">
        <div className={styles['search__policyholder-wrapper']}>
          <SearchInput
            data-testid="policyholder-input-search"
            label="CNPJ ou Razão Social"
            placeholder="Pesquise o tomador pelo CNPJ ou Razão Social"
            onChange={handleChangePolicyholderInput}
            changeValueOnSelect={false}
            value={policyholderInput}
            options={mappedPolicyholders}
            onValueSelected={setPolicyholderOption}
            emptyMessage="Nenhum corretor encontrado"
          />

          {policyholderDetails}
        </div>

        {policyholderSubidiariesOptions}

        <div
          className={styles['search__modality-wrapper']}
          data-testid="policyholder-modality"
        >
          <Dropdown
            label="Selecione a modalidade"
            placeholder="Selecione a modalidade"
            options={mappedModalities}
            disabled={!hasValidPolicyholder}
            onValueSelected={setModalityOption}
            value={currentModality}
          />
        </div>
      </form>
    </StepContainer>
  );
};

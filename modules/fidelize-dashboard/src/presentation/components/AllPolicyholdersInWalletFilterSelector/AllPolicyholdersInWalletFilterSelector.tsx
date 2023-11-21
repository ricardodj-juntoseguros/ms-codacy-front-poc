import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, SearchInput, SearchOptions } from 'junto-design-system';
import classNames from 'classnames';
import { federalIdFormatter, objectArraysMerger } from '@shared/utils';
import { summariesQuantitativeActions } from '../../../application/features/summariesQuantitative/SummariesQuantitativeSlice';
import SummariesQuantitativeApi from '../../../application/features/summariesQuantitative/SummariesQuantitativeApi';
import { AllPolicyholdersInWalletDTO } from '../../../application/types/dto';
import {
  allPolicyholdersInWalletFilterActions,
  selectAllPolicyholdersSelection,
  selectAllMappedPolicyholders,
  selectAllErrorFetchPolicyholders,
} from '../../../application/features/viewAllPolicyholdersInWallet/ViewAllPolicyholdersInWalletSlice';

import { summaryChartsActions } from '../../../application/features/summaryCharts/SummaryChartsSlice';
import styles from './AllPolicyholdersInWalletFilterSelector.module.scss';
import AllPolicyholdersInWalletFilterSelectorTags from '../AllPolicyholdersInWalletFilterSelectorTags/AllPolicyholdersInWalletFilterSelectorTags';

const AllPolicyholdersInWalletFilterSelector: React.FC = () => {
  const dispatch = useDispatch();

  const mappedPolicyholders = useSelector(selectAllMappedPolicyholders) || [];
  const storePolicyholderSelection = useSelector(
    selectAllPolicyholdersSelection,
  );
  const fetchError = useSelector(selectAllErrorFetchPolicyholders);

  const selectionLossModalRef = useRef<HTMLDivElement>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchedPolicyholders, setSearchedPolicyholders] =
    useState<AllPolicyholdersInWalletDTO[]>(mappedPolicyholders);
  const [selectedPolicyholders, setSelectedPolicyholders] = useState<
    AllPolicyholdersInWalletDTO[]
  >([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [showMaxAlert, setShowMaxAlert] = useState(false);

  useEffect(() => {
    const selectedFederalIds = selectedPolicyholders.map(
      selected => selected.policyholderFederalId,
    );

    if (
      selectedFederalIds.length === 0 &&
      storePolicyholderSelection.length === 0
    ) {
      setHasChanges(false);
    } else {
      setHasChanges(
        selectedFederalIds.length === storePolicyholderSelection.length
          ? !selectedFederalIds.every(selected => {
              if (storePolicyholderSelection.includes(selected)) {
                return true;
              }
              return false;
            })
          : true,
      );
    }
  }, [selectedPolicyholders, storePolicyholderSelection]);

  const mapSearchOptions = (): SearchOptions[] => {
    if (fetchError)
      return [
        {
          label: 'Opa! Ocorreu um erro inesperado ao buscar os tomadores.',
          value: '-1',
        },
      ];

    if (mappedPolicyholders.length === 0)
      return [{ label: 'Carregando...', value: '-1' }];

    const options = searchedPolicyholders.map(policyholder => ({
      label: `${policyholder.policyholderName} - ${federalIdFormatter(
        policyholder.policyholderFederalId,
      )}`,
      value: policyholder.policyholderFederalId,
    }));

    return options;
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (value.length < 3) {
      setSearchedPolicyholders(mappedPolicyholders);
      return;
    }
    const filteredByName = mappedPolicyholders.filter(policyholder =>
      policyholder.policyholderName.toLowerCase().includes(value.toLowerCase()),
    );
    const filteredByFederalId = mappedPolicyholders.filter(policyholder =>
      policyholder.policyholderFederalId.includes(value),
    );
    const mergedPolicyholders = objectArraysMerger(
      filteredByName,
      filteredByFederalId,
      'federalId',
    );
    setSearchedPolicyholders(mergedPolicyholders);
  };

  const handleValueSelected = (selectedOption: SearchOptions) => {
    const { value } = selectedOption;
    if (value === '-1') return;

    const selectedPolicyholder = mappedPolicyholders.find(
      policyholder => policyholder.policyholderFederalId === value,
    );

    if (selectedPolicyholders.length === 5) {
      setShowMaxAlert(true);
      setTimeout(() => setShowMaxAlert(false), 5000);
      return;
    }

    if (
      !selectedPolicyholder ||
      selectedPolicyholders.find(p => p.policyholderFederalId === value)
    )
      return;

    setSelectedPolicyholders(prevSelectedPolicyholders => [
      ...prevSelectedPolicyholders,
      selectedPolicyholder,
    ]);
    handleSearchChange('');
  };

  const handleRemoveTag = (policyholder: AllPolicyholdersInWalletDTO) => {
    setSelectedPolicyholders(prevSelectedPolicyholders =>
      prevSelectedPolicyholders.filter(
        p => p.policyholderFederalId !== policyholder.policyholderFederalId,
      ),
    );
  };

  const handleClearAll = () => {
    const clearAction = () => {
      setSelectedPolicyholders([]);
      dispatch(summaryChartsActions.clearAllChartsData());
      dispatch(
        allPolicyholdersInWalletFilterActions.setPolicyholderSelection({
          selection: [],
        }),
      );
    };
    clearAction();
  };

  const handleGetQuantitativeSummaries = () => {
    const federalIds = selectedPolicyholders.map(
      policyholder => policyholder.policyholderFederalId,
    );

    getSummariesByPolicyholder(federalIds);
    setHasChanges(false);
    return [];
  };

  const getSummariesByPolicyholder = async (federalIds: string[]) => {
    dispatch(
      summariesQuantitativeActions.setSummariesQuantitative(
        await SummariesQuantitativeApi.getSummariesByPolicyholdersList(
          federalIds,
        ),
      ),
    );
  };

  return (
    <div
      className={classNames(
        styles['all-policyholders-in-wallet-filter-selector__wrapper'],
        {
          [styles[
            'all-policyholders-in-wallet-filter-selector__wrapper--has-tags'
          ]]: selectedPolicyholders.length > 0,
        },
      )}
    >
      <p
        className={
          styles['all-policyholders-in-wallet-filter-selector__helper-text']
        }
      >
        Informe os dados dos tomadores e selecione aqueles que deseja mapear. Ao
        finalizar a seleção, continue para a verificação da estimativa de
        processos.
      </p>
      <div
        className={
          styles['all-policyholders-in-wallet-filter-selector__input-grid']
        }
      >
        <div>
          <SearchInput
            data-testid="all-policyholders-in-wallet-search-input"
            label="CNPJ ou Razão Social do tomador"
            icon=""
            placeholder="CNPJ ou Razão Social do tomador "
            value={searchValue}
            options={mapSearchOptions()}
            changeValueOnSelect={false}
            onChange={handleSearchChange}
            onValueSelected={handleValueSelected}
            onFocus={e => e.target.select()}
          />
          <AllPolicyholdersInWalletFilterSelectorTags
            selectedPolicyholders={selectedPolicyholders}
            onClear={() => handleClearAll()}
            onRemove={handleRemoveTag}
            showMaxAlert={showMaxAlert}
          />
        </div>
        <div>
          <Button
            data-testid="btn-apply-policyholders-filter"
            disabled={!hasChanges}
            onClick={() => handleGetQuantitativeSummaries()}
          >
            Verificar estimativa
          </Button>
        </div>
      </div>
      <div ref={selectionLossModalRef} />
    </div>
  );
};

export default AllPolicyholdersInWalletFilterSelector;

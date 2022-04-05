import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, SearchInput, SearchOptions } from 'junto-design-system';
import { federalIdFormatter, objectArraysMerger } from '@shared/utils';
import classNames from 'classnames';
import PolicyholderFilterSelectorTags from '../PolicyholderFilterSelectorTags';
import { PolicyholderDTO } from '../../../application/types/dto';
import PolicyholderFilterApi from '../../../application/features/policyholderFilter/PolicyholderFilterApi';
import {
  selectPolicyholderSelection,
  policyholderFilterActions,
} from '../../../application/features/policyholderFilter/PolicyholderFilterSlice';
import styles from './PolicyholderFilterSelector.module.scss';

const PolicyholderFilterSelector: React.FC = () => {
  const storePolicyholders = useSelector(selectPolicyholderSelection);
  const dispatch = useDispatch();

  const [searchValue, setSearchValue] = useState<string>('');
  const [policyholders, setPolicyholders] = useState<PolicyholderDTO[]>([]);
  const [searchedPolicyholders, setSearchedPolicyholders] = useState<
    PolicyholderDTO[]
  >([]);
  const [selectedPolicyholders, setSelectedPolicyholders] = useState<
    PolicyholderDTO[]
  >([]);
  const [fetchError, setFetchError] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  useEffect(() => {
    PolicyholderFilterApi.getMappedPolicyholderList()
      .then(response => {
        setPolicyholders(response);
        setSearchedPolicyholders(response);
      })
      .catch(() => {
        setFetchError(true);
      });
  }, []);

  useEffect(() => {
    const selectedFederalIds = selectedPolicyholders.map(
      selected => selected.federalId,
    );

    if (selectedFederalIds.length === 0 && storePolicyholders.length === 0) {
      setHasChanges(false);
    } else {
      setHasChanges(
        selectedFederalIds.length === storePolicyholders.length
          ? !selectedFederalIds.every(selected => {
              if (storePolicyholders.includes(selected)) {
                return true;
              }
              return false;
            })
          : true,
      );
    }
  }, [selectedPolicyholders, storePolicyholders]);

  const mapSearchOptions = (): SearchOptions[] => {
    if (fetchError)
      return [
        {
          label: 'Opa! Ocorreu um erro inesperado ao buscar os tomadores.',
          value: '-1',
        },
      ];

    if (policyholders.length === 0)
      return [{ label: 'Carregando...', value: '-1' }];

    const options = searchedPolicyholders.map(policyholder => ({
      label: `${policyholder.name} - ${federalIdFormatter(
        policyholder.federalId,
      )}`,
      value: policyholder.federalId,
    }));

    return options;
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (value.length < 3) {
      setSearchedPolicyholders(policyholders);
      return;
    }
    const filteredByName = policyholders.filter(policyholder =>
      policyholder.name.toLowerCase().includes(value.toLowerCase()),
    );
    const filteredByFederalId = policyholders.filter(policyholder =>
      policyholder.federalId.includes(value),
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

    const selectedPolicyholder = policyholders.find(
      policyholder => policyholder.federalId === value,
    );

    if (
      !selectedPolicyholder ||
      selectedPolicyholders.length === 10 ||
      selectedPolicyholders.find(p => p.federalId === value)
    )
      return;

    setSelectedPolicyholders(prevSelectedPolicyholders => [
      ...prevSelectedPolicyholders,
      selectedPolicyholder,
    ]);
    handleSearchChange('');
  };

  const handleRemoveTag = (policyholder: PolicyholderDTO) => {
    setSelectedPolicyholders(prevSelectedPolicyholders =>
      prevSelectedPolicyholders.filter(
        p => p.federalId !== policyholder.federalId,
      ),
    );
  };

  const handleClearAll = () => {
    setSelectedPolicyholders([]);
    dispatch(
      policyholderFilterActions.setPolicyholderSelection({
        selection: [],
      }),
    );
  };

  const handleApplyFilter = () => {
    dispatch(
      policyholderFilterActions.setPolicyholderSelection({
        selection: selectedPolicyholders.map(selected => selected.federalId),
      }),
    );
  };

  return (
    <div
      className={classNames(styles['policyholder-filter-selector__wrapper'], {
        [styles['policyholder-filter-selector__wrapper--has-tags']]:
          selectedPolicyholders.length > 0,
      })}
    >
      <p className={styles['policyholder-filter-selector__helper-text']}>
        Informe a Razão Social ou CNPJ do tomador que deseja visualizar as
        informações abaixo
      </p>
      <div className={styles['policyholder-filter-selector__input-grid']}>
        <div>
          <SearchInput
            label="Busque por tomador"
            icon="search"
            placeholder="Busque por tomador"
            value={searchValue}
            options={mapSearchOptions()}
            changeValueOnSelect={false}
            onChange={handleSearchChange}
            onValueSelected={handleValueSelected}
            onFocus={e => e.target.select()}
          />
          <PolicyholderFilterSelectorTags
            selectedPolicyholders={selectedPolicyholders}
            onClear={() => handleClearAll()}
            onRemove={handleRemoveTag}
          />
        </div>
        <div>
          <Button
            data-testid="btn-apply-filter"
            disabled={!hasChanges}
            onClick={() => handleApplyFilter()}
          >
            Aplicar filtro
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PolicyholderFilterSelector;

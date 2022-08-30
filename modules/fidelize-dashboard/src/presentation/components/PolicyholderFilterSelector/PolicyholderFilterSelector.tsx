import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, SearchInput, SearchOptions } from 'junto-design-system';
import TagManager from 'react-gtm-module';
import classNames from 'classnames';
import { federalIdFormatter, objectArraysMerger } from '@shared/utils';
import { renderOpportunitySelectionLossModal } from '../../../helpers';
import PolicyholderFilterSelectorTags from '../PolicyholderFilterSelectorTags';
import { PolicyholderDTO } from '../../../application/types/dto';
import {
  selectPolicyholderSelection,
  policyholderFilterActions,
  selectMappedPolicyholders,
  selectErrorFetchPolicyholders,
} from '../../../application/features/policyholderFilter/PolicyholderFilterSlice';
import {
  opportunitiesDetailsActions,
  selectSelectedOpportunities,
} from '../../../application/features/opportunitiesDetails/OpportunitiesDetailsSlice';
import { summaryActions } from '../../../application/features/summary/SummarySlice';
import { summaryChartsActions } from '../../../application/features/summaryCharts/SummaryChartsSlice';
import styles from './PolicyholderFilterSelector.module.scss';

const PolicyholderFilterSelector: React.FC = () => {
  const dispatch = useDispatch();
  const mappedPolicyholders = useSelector(selectMappedPolicyholders) || [];
  const storePolicyholderSelection = useSelector(selectPolicyholderSelection);
  const selectedOpportunities = useSelector(selectSelectedOpportunities);
  const fetchError = useSelector(selectErrorFetchPolicyholders);

  const selectionLossModalRef = useRef<HTMLDivElement>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchedPolicyholders, setSearchedPolicyholders] =
    useState<PolicyholderDTO[]>(mappedPolicyholders);
  const [selectedPolicyholders, setSelectedPolicyholders] = useState<
    PolicyholderDTO[]
  >([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [showMaxAlert, setShowMaxAlert] = useState(false);

  useEffect(() => {
    const selectedFederalIds = selectedPolicyholders.map(
      selected => selected.federalId,
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
      setSearchedPolicyholders(mappedPolicyholders);
      return;
    }
    const filteredByName = mappedPolicyholders.filter(policyholder =>
      policyholder.name.toLowerCase().includes(value.toLowerCase()),
    );
    const filteredByFederalId = mappedPolicyholders.filter(policyholder =>
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

    const selectedPolicyholder = mappedPolicyholders.find(
      policyholder => policyholder.federalId === value,
    );

    if (selectedPolicyholders.length === 10) {
      setShowMaxAlert(true);
      setTimeout(() => setShowMaxAlert(false), 5000);
      return;
    }

    if (
      !selectedPolicyholder ||
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
    const clearAction = () => {
      setSelectedPolicyholders([]);
      dispatch(opportunitiesDetailsActions.resetSettings());
      dispatch(summaryChartsActions.clearAllChartsData());
      dispatch(
        policyholderFilterActions.setPolicyholderSelection({
          selection: [],
        }),
      );
      dispatch(
        summaryActions.setTotalPolicyholders(mappedPolicyholders.length),
      );
    };
    return selectedOpportunities.length > 0
      ? renderOpportunitySelectionLossModal(
          clearAction,
          selectionLossModalRef.current,
        )
      : clearAction();
  };

  const handleApplyFilter = () => {
    const applyAction = () => {
      const count = selectedPolicyholders.length;
      dispatch(opportunitiesDetailsActions.resetSettings());
      dispatch(summaryChartsActions.clearAllChartsData());
      dispatch(
        policyholderFilterActions.setPolicyholderSelection({
          selection: selectedPolicyholders.map(selected => selected.federalId),
        }),
      );
      if (count > 0) {
        dispatch(summaryActions.setTotalPolicyholders(count));
        TagManager.dataLayer({
          dataLayer: {
            event: 'ClickApplyPolicyholderFilterButton',
            policyholderCount: count,
          },
        });
      } else {
        dispatch(
          summaryActions.setTotalPolicyholders(mappedPolicyholders.length),
        );
      }
    };

    return selectedOpportunities.length > 0
      ? renderOpportunitySelectionLossModal(
          applyAction,
          selectionLossModalRef.current,
        )
      : applyAction();
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
            showMaxAlert={showMaxAlert}
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
      <div ref={selectionLossModalRef} />
    </div>
  );
};

export default PolicyholderFilterSelector;

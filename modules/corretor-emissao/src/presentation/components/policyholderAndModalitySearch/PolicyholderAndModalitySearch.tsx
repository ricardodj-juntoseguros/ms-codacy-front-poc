import { useMemo } from 'react';
import {
  SearchInput,
  LinkButton,
  Dropdown,
  DropdownOption,
  OptionProps,
} from '@junto-design-system';
import styles from './PolicyholderAndModalitySearch.module.scss';
import {
  PolicyholderModel,
  ModalityModel,
  SubsidiaryModel,
} from '../../../application/types/model';

export interface PolicyholderAndModalitySearchProps {
  searchValue: string;
  onChangeSearchValue: (value: string) => void;
  onSelectPolicyholder: (value: PolicyholderModel) => void;
  policyholderOptions: PolicyholderModel[];
  hasValidPolicyholder: boolean;
  handlePolicyholderDetails: () => void;
  modalityOptions: ModalityModel[];
  onChangeModalityValue: (option: ModalityModel) => void;
  subsidiaryOptions: SubsidiaryModel[];
  onChangeSubsidiaryValue: (option: SubsidiaryModel) => void;
}

export function PolicyholderAndModalitySearch({
  searchValue,
  onChangeSearchValue,
  onSelectPolicyholder,
  policyholderOptions,
  hasValidPolicyholder,
  handlePolicyholderDetails,
  modalityOptions,
  onChangeModalityValue,
  subsidiaryOptions,
  onChangeSubsidiaryValue,
}: PolicyholderAndModalitySearchProps) {
  const mapPolicyholderOptions = useMemo(() => {
    return policyholderOptions.map(p => ({
      ...p,
      label: `${p.companyName} - ${p.federalId}`,
      id: p.id,
    }));
  }, [policyholderOptions]);

  const mapModalityOptions: DropdownOption[] = useMemo(() => {
    return modalityOptions.map(m => ({
      ...m,
      label: m.description,
      value: m.id,
    }));
  }, [modalityOptions]);

  const mapSubsidiaryOptions: DropdownOption[] = useMemo(() => {
    return subsidiaryOptions.map(s => ({
      ...s,
      label: s.label,
      value: s.id,
    }));
  }, [subsidiaryOptions]);

  function onChangePolicyholderSearch(option: OptionProps) {
    const selectedPolicyholder = policyholderOptions.find(
      p => p.id === option.id,
    );

    if (selectedPolicyholder) onSelectPolicyholder(selectedPolicyholder);
  }

  function onChangeModalityDropdown(option: DropdownOption | null) {
    if (option) {
      const selectedModality = modalityOptions.find(m => m.id === option.value);
      if (selectedModality) onChangeModalityValue(selectedModality);
    }
  }

  function onChangeSubsidiaryDropdown(option: DropdownOption | null) {
    if (option) {
      const selectedSubsidiary = subsidiaryOptions.find(
        m => m.id === option.value,
      );
      if (selectedSubsidiary) onChangeSubsidiaryValue(selectedSubsidiary);
    }
  }

  return (
    <main
      className={styles['policyholder-search']}
      data-testid="policyholder-search"
    >
      <form>
        <div className={styles['policyholder-search__search-wrapper']}>
          <SearchInput
            data-testid="policyholder-input-search"
            type="text"
            label="CNPJ ou Razão Social"
            placeholder="Pesquise o tomador pelo CNPJ ou Razão Social"
            onChange={onChangeSearchValue}
            value={searchValue}
            icon="search"
            options={mapPolicyholderOptions}
            onValueSelected={onChangePolicyholderSearch}
          />
        </div>

        {hasValidPolicyholder && (
          <LinkButton
            label="Ver detalhes deste tomador"
            size="small"
            onClick={handlePolicyholderDetails}
          />
        )}

        <div
          className={styles['policyholder-search__modality-wrapper']}
          data-testid="policyholder-modality"
        >
          <Dropdown
            placeholder="Selecione a modalidade"
            options={mapModalityOptions}
            isSearchable={false}
            isDisabled={!hasValidPolicyholder}
            onChange={onChangeModalityDropdown}
          />
        </div>

        {subsidiaryOptions.length !== 0 && (
          <div
            className={styles['policyholder-search__subsidiary-wrapper']}
            data-testid="policyholder-subsidiary"
          >
            <Dropdown
              placeholder="Selecione a filial"
              options={mapSubsidiaryOptions}
              isSearchable={false}
              onChange={onChangeSubsidiaryDropdown}
            />
          </div>
        )}
      </form>
    </main>
  );
}

export default PolicyholderAndModalitySearch;

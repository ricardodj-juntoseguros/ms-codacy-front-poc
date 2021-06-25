import { SearchInput, LinkButton, Dropdown } from 'junto-design-system';
import { useOptionsMapper } from '@shared/hooks';
import { useMemo } from 'react';
import styles from './PolicyholderAndModalitySearch.module.scss';
import {
  PolicyholderModel,
  ModalityModel,
  SubsidiaryModel,
} from '../../../application/types/model';

export interface PolicyholderAndModalitySearchProps {
  onChangePolicyholderInput: (value: string) => void;
  policyholderInput: string;
  onSelectPolicyholder: (value: PolicyholderModel) => void;
  policyholderOptions: PolicyholderModel[];
  hasValidPolicyholder: boolean;
  handlePolicyholderDetails: () => void;
  modalityOptions: ModalityModel[];
  onSelectModality: (option: ModalityModel) => void;
  modality: ModalityModel | null;
  subsidiaryOptions: SubsidiaryModel[];
  onSelectSubsidiary: (option: SubsidiaryModel) => void;
  subsidiary: SubsidiaryModel | null;
}

export function PolicyholderAndModalitySearch({
  onChangePolicyholderInput,
  policyholderInput,
  onSelectPolicyholder,
  policyholderOptions,
  hasValidPolicyholder,
  handlePolicyholderDetails,
  modalityOptions,
  onSelectModality,
  modality,
  subsidiaryOptions,
  onSelectSubsidiary,
  subsidiary,
}: PolicyholderAndModalitySearchProps) {
  const {
    mappedOptions: mappedPolicyholders,
    selectOption: setPolicyholderOption,
  } = useOptionsMapper(
    policyholderOptions,
    'companyName',
    'federalId',
    'id',
    onSelectPolicyholder,
  );

  const { mappedOptions: mappedModalities, selectOption: setModalityOption } =
    useOptionsMapper(
      modalityOptions,
      'description',
      '',
      'id',
      onSelectModality,
    );

  const currentModality = useMemo(() => {
    return mappedModalities.find(item => item.id === modality?.id) || null;
  }, [mappedModalities, modality]);

  const {
    mappedOptions: mappedSubsidiaries,
    selectOption: setSubsidiaryOption,
  } = useOptionsMapper(
    subsidiaryOptions,
    'label',
    '',
    'id',
    onSelectSubsidiary,
  );

  const currentSubsidiary = useMemo(() => {
    return mappedSubsidiaries.find(item => item.id === subsidiary?.id) || null;
  }, [mappedSubsidiaries, subsidiary]);

  return (
    <main
      className={styles['policyholder-search']}
      data-testid="policyholder-search"
    >
      <div className={styles['policyholder-search__search-wrapper']}>
        <SearchInput
          data-testid="policyholder-input-search"
          label="CNPJ ou Razão Social"
          placeholder="Pesquise o tomador pelo CNPJ ou Razão Social"
          onChange={onChangePolicyholderInput}
          value={policyholderInput}
          options={mappedPolicyholders}
          onValueSelected={setPolicyholderOption}
        />

        {hasValidPolicyholder && (
          <LinkButton
            label="Ver detalhes deste tomador"
            size="small"
            onClick={handlePolicyholderDetails}
          />
        )}
      </div>

      {subsidiaryOptions.length !== 0 && (
        <div
          className={styles['policyholder-search__subsidiary-wrapper']}
          data-testid="policyholder-subsidiary"
        >
          <Dropdown
            placeholder="Selecione a filial"
            label="Selecione a filial"
            options={mappedSubsidiaries}
            onValueSelected={setSubsidiaryOption}
            value={currentSubsidiary}
          />
        </div>
      )}

      <div
        className={styles['policyholder-search__modality-wrapper']}
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
    </main>
  );
}

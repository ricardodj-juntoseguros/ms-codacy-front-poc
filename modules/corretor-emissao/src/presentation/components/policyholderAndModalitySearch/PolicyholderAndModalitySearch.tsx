import { SearchInput, LinkButton, Dropdown } from 'junto-design-system';
import { useOptionsMapper } from '@shared/hooks';
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
  modalityInput: string;
  onChangeModalityInput: (value: string) => void;
  subsidiaryOptions: SubsidiaryModel[];
  onSelectSubsidiary: (option: SubsidiaryModel) => void;
  subsidiaryInput: string;
  onChangeSubsidiaryInput: (value: string) => void;
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
  modalityInput,
  onChangeModalityInput,
  subsidiaryOptions,
  onSelectSubsidiary,
  subsidiaryInput,
  onChangeSubsidiaryInput,
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
          onValueSelected={option => setPolicyholderOption(option)}
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
            onChange={onChangeSubsidiaryInput}
            value={subsidiaryInput}
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
          onChange={onChangeModalityInput}
          value={modalityInput}
        />
      </div>
    </main>
  );
}

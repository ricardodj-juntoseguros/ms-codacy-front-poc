import { SearchInput, LinkButton, Dropdown } from 'junto-design-system';
import { useOptionsMapper } from '@shared/hooks';
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
      onChangeModalityValue,
    );

  const {
    mappedOptions: mappedSubsidiaries,
    selectOption: setSubsidiaryOption,
  } = useOptionsMapper(
    subsidiaryOptions,
    'label',
    '',
    'id',
    onChangeSubsidiaryValue,
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
          onChange={onChangeSearchValue}
          value={searchValue}
          options={mappedPolicyholders}
          onValueSelected={option => setPolicyholderOption(option)}
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
          label="Selecione a modalidade"
          placeholder="Selecione a modalidade"
          options={mappedModalities}
          searchable={false}
          disabled={!hasValidPolicyholder}
          onValueSelected={option => setModalityOption(option)}
          onChange={value => console.log(value)}
          value=""
        />
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
            searchable={false}
            onValueSelected={setSubsidiaryOption}
            onChange={value => console.log(value)}
            value=""
          />
        </div>
      )}
    </main>
  );
}

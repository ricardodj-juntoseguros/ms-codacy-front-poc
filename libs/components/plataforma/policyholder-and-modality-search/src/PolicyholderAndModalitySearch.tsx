import { SearchInput, LinkButton, Dropdown } from '@junto-design-system';
import styles from './PolicyholderAndModalitySearch.module.scss';

export interface DropdownOptionsProps {
  label: string;
  value: string;
}

export interface PolicyholderAndModalitySearchProps {
  searchOptions: Array<string>;
  modalityOptions: Array<DropdownOptionsProps>;
  subsidiaryOptions: Array<DropdownOptionsProps>;
  hasValidPolicyholder: boolean;
  searchValue: string;
  handleSetSearchValue(option: string): void;
  handleSetModalityValue(option: DropdownOptionsProps): void;
  handleSetSubsidiaryValue(option: DropdownOptionsProps): void;
  handlePolicyholderDetails(): void;
}

export function PolicyholderAndModalitySearch({
  searchOptions,
  modalityOptions,
  subsidiaryOptions,
  hasValidPolicyholder,
  searchValue,
  handleSetSearchValue,
  handleSetModalityValue,
  handleSetSubsidiaryValue,
  handlePolicyholderDetails,
}: PolicyholderAndModalitySearchProps) {
  return (
    <main
      className={styles['policyholder-search']}
      data-testid="policyholder-search"
    >
      <h2 className={styles['policyholder-search__title']}>
        Digite o <strong>CNPJ</strong> ou a <strong>razão social</strong> do
        tomador e selecione a <strong>modalidade</strong> do seguro
      </h2>

      <form>
        <div className={styles['policyholder-search__search-wrapper']}>
          <SearchInput
            data-testid="policyholder-input-search"
            type="text"
            label="CNPJ ou Razão Social"
            placeholder=" "
            onChange={handleSetSearchValue}
            value={searchValue}
            icon="search"
            options={searchOptions}
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
            options={modalityOptions}
            isSearchable={false}
            isDisabled={!hasValidPolicyholder}
            onChange={handleSetModalityValue}
          />
        </div>

        {subsidiaryOptions.length !== 0 && (
          <div
            className={styles['policyholder-search__subsidiary-wrapper']}
            data-testid="policyholder-subsidiary"
          >
            <Dropdown
              placeholder="Selecione a filial"
              options={subsidiaryOptions}
              isSearchable={false}
              onChange={handleSetSubsidiaryValue}
            />
          </div>
        )}
      </form>
    </main>
  );
}

export default PolicyholderAndModalitySearch;

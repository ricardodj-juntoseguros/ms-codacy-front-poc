import styles from './PolicyholderAndModalitySearch.module.scss';

import { SearchInput } from 'junto-design-system/src/components/SearchInput';
import { LinkButton } from 'junto-design-system/src/components/LinkButton';
import { Dropdown } from 'junto-design-system/src/components/Dropdown';

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


export function PolicyholderAndModalitySearch(props: PolicyholderAndModalitySearchProps) {
  return (
    <main className={styles['policyholder-search']} data-testid="policyholder-search">
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
            onChange={props.handleSetSearchValue}
            value={props.searchValue}
            icon="search"
            options={props.searchOptions}
          />
        </div>

        {props.hasValidPolicyholder && (
          <LinkButton
            label="Ver detalhes deste tomador"
            size="small"
            onClick={props.handlePolicyholderDetails}
          />
        )}

          <div className={styles['policyholder-search__modality-wrapper']} data-testid="policyholder-modality">
            <Dropdown
              placeholder="Selecione a modalidade"
              options={props.modalityOptions}
              isSearchable={false}
              isDisabled={!props.hasValidPolicyholder}
              onChange={props.handleSetModalityValue}
            />
          </div>

        {props.subsidiaryOptions.length !== 0 && (
          <div className={styles['policyholder-search__subsidiary-wrapper']} data-testid="policyholder-subsidiary">
            <Dropdown
              placeholder="Selecione a filial"
              options={props.subsidiaryOptions}
              isSearchable={false}
              onChange={props.handleSetSubsidiaryValue}
            />
          </div>
        )}
      </form>
    </main>
  );
}

export default PolicyholderAndModalitySearch;

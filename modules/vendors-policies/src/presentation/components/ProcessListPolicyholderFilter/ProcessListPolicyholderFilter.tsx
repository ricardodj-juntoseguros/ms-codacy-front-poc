import { useState } from 'react';
import { UserTypeEnum, VendorsAuthService } from '@services';
import { useDebounce } from '@shared/hooks';
import classNames from 'classnames';
import {
  LinkButton,
  SearchInput,
  SearchOptions,
  makeToast,
} from 'junto-design-system';
import ProcessListingApi from '../../../application/features/processListing/ProcessListingApi';
import styles from './ProcessListPolicyholderFilter.module.scss';

interface ProcessListPolicyholderFilterProps {
  showClearButton: boolean;
  selectPolicyholderCallback: (policyholderFederalId: string | null) => void;
}

const ProcessListPolicyholderFilter: React.FC<ProcessListPolicyholderFilterProps> =
  ({ showClearButton, selectPolicyholderCallback }) => {
    const [inputValue, setInputValue] = useState<string>();
    const [inputValueOnFocus, setInputValueOnFocus] = useState<string>();
    const [inputOptions, setInputOptions] = useState<SearchOptions[]>([]);
    const [loadingOptions, setLoadingOptions] = useState<boolean>(false);
    const userType = VendorsAuthService.getUserType();

    useDebounce(
      () => {
        if (inputOptions.some(opt => opt.label === inputValue)) return;
        if (userType !== UserTypeEnum.POLICYHOLDER) {
          fetchPolicyholderOptions(inputValue || '');
        }
      },
      1500,
      [inputValue, userType],
    );

    const fetchPolicyholderOptions = (searchValue: string) => {
      if (searchValue.length < 3) return;
      setLoadingOptions(true);
      ProcessListingApi.searchPolicyholderOptions(searchValue)
        .then(response => {
          setInputOptions(
            response.map(({ corporateName, federalId }) => ({
              label: corporateName,
              value: federalId,
            })),
          );
        })
        .catch(error => makeToast('error', error))
        .finally(() => setLoadingOptions(false));
    };

    const handleOptionSelection = (selectedOption: SearchOptions) => {
      const { label, value } = selectedOption;
      setInputOptions(prevInputOptions =>
        prevInputOptions.filter(opt => opt.value === value),
      );
      setInputValue(label);
      selectPolicyholderCallback(value);
    };

    const handleInputBlur = () => {
      if (
        inputValueOnFocus &&
        (!inputValue || inputValue.trim().length === 0)
      ) {
        setInputOptions([]);
        selectPolicyholderCallback(null);
      }
    };

    const handleClearClick = () => {
      setInputValue('');
      setInputOptions([]);
      selectPolicyholderCallback(null);
    };

    return (
      <div
        className={classNames(
          styles['process-list-policyholder-filter__wrapper'],
          {
            [styles['process-list-policyholder-filter__wrapper--loading']]:
              loadingOptions,
          },
        )}
      >
        <SearchInput
          data-testid="processListPolicyholderFilter-input-search"
          variant="medium"
          icon={loadingOptions ? 'loading' : 'search'}
          label="Busque pelo nome do fornecedor"
          placeholder="Busque pelo nome do fornecedor"
          value={inputValue}
          options={inputOptions}
          onChange={value => setInputValue(value)}
          onBlur={() => handleInputBlur()}
          onFocus={() => setInputValueOnFocus(inputValue)}
          onValueSelected={opt => handleOptionSelection(opt)}
        />
        {showClearButton && (
          <LinkButton
            data-testid="processListPolicyholderFilter-btn-clear"
            label="Limpar busca"
            onClick={() => handleClearClick()}
          />
        )}
      </div>
    );
  };

export default ProcessListPolicyholderFilter;

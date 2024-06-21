import { useEffect, useMemo, useState } from 'react';
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
    const userType = VendorsAuthService.getUserType();
    const [inputValue, setInputValue] = useState<string>();
    const [inputValueOnFocus, setInputValueOnFocus] = useState<string>();
    const [inputOptions, setInputOptions] = useState<SearchOptions[]>([]);
    const [loadingOptions, setLoadingOptions] = useState<boolean>(false);

    useDebounce(
      () => {
        if (userType === UserTypeEnum.POLICYHOLDER) return;
        if (!userType || inputOptions.some(opt => opt.label === inputValue))
          return;
        fetchPolicyholderOptions(userType, inputValue || '');
      },
      1500,
      [inputValue, userType],
    );

    useEffect(() => {
      if (userType === UserTypeEnum.POLICYHOLDER) {
        fetchPolicyholderOptions(userType);
      }
    }, [userType]);

    const filteredInputOptions = useMemo(() => {
      if (userType !== UserTypeEnum.POLICYHOLDER || !inputValue) return [];
      return inputOptions.filter(({ label }) => {
        return (
          label.toLowerCase().includes(inputValue.toLowerCase()) ||
          label === inputValue
        );
      });
    }, [inputValue, inputOptions, userType]);

    const fetchPolicyholderOptions = (
      userType: UserTypeEnum,
      searchValue?: string | undefined,
    ) => {
      if (
        userType !== UserTypeEnum.POLICYHOLDER &&
        (searchValue?.length || 0) < 3
      )
        return;
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
        .catch(() =>
          makeToast(
            'error',
            'Ocorreu um erro inesperado ao buscar os fornecedores.',
          ),
        )
        .finally(() => setLoadingOptions(false));
    };

    const handleOptionSelection = (selectedOption: SearchOptions) => {
      const { value } = selectedOption;
      if (userType !== UserTypeEnum.POLICYHOLDER) {
        setInputOptions(prevInputOptions =>
          prevInputOptions.filter(opt => opt.value === value),
        );
      }
      selectPolicyholderCallback(value);
    };

    const handleInputBlur = () => {
      if (
        inputValueOnFocus &&
        (!inputValue || inputValue.trim().length === 0)
      ) {
        if (userType !== UserTypeEnum.POLICYHOLDER) {
          setInputOptions([]);
        }
        selectPolicyholderCallback(null);
      }
    };

    const handleClearClick = () => {
      setInputValue('');
      selectPolicyholderCallback(null);
      if (userType !== UserTypeEnum.POLICYHOLDER) {
        setInputOptions([]);
      }
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
          options={
            userType === UserTypeEnum.POLICYHOLDER
              ? filteredInputOptions
              : inputOptions
          }
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

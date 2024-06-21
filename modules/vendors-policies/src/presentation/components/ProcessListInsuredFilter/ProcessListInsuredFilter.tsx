import { useEffect, useMemo, useState } from 'react';
import { useDebounce } from '@shared/hooks';
import { VendorsAuthService, UserTypeEnum } from '@services';
import classNames from 'classnames';
import {
  LinkButton,
  SearchInput,
  SearchOptions,
  makeToast,
} from 'junto-design-system';
import ProcessListingApi from '../../../application/features/processListing/ProcessListingApi';
import styles from './ProcessListInsuredFilter.module.scss';

interface ProcessListInsuredFilterProps {
  showClearButton: boolean;
  selectInsuredCallback: (insuredFederalId: string | null) => void;
}

const ProcessListInsuredFilter: React.FC<ProcessListInsuredFilterProps> = ({
  showClearButton,
  selectInsuredCallback,
}) => {
  const userType = VendorsAuthService.getUserType();
  const [inputValue, setInputValue] = useState<string>('');
  const [inputValueOnFocus, setInputValueOnFocus] = useState<string>();
  const [inputOptions, setInputOptions] = useState<SearchOptions[]>([]);
  const [loadingOptions, setLoadingOptions] = useState<boolean>(false);

  useEffect(() => {
    if (userType !== UserTypeEnum.POLICYHOLDER) {
      fetchInsuredOptions();
    }
  }, [userType]);

  useDebounce(
    () => {
      if (userType !== UserTypeEnum.POLICYHOLDER) return;
      if (
        !userType ||
        inputValue.length < 3 ||
        inputOptions.some(opt => opt.label === inputValue)
      )
        return;
      fetchInsuredOptions(inputValue || '');
    },
    1500,
    [inputValue, userType],
  );

  const filteredInputOptions = useMemo(() => {
    if (userType === UserTypeEnum.POLICYHOLDER || !inputValue) return [];
    return inputOptions.filter(({ label }) => {
      return (
        label.toLowerCase().includes(inputValue.toLowerCase()) ||
        label === inputValue
      );
    });
  }, [inputValue, inputOptions, userType]);

  const fetchInsuredOptions = (name?: string) => {
    setLoadingOptions(true);
    ProcessListingApi.getInsuredOptions(name)
      .then(response => {
        setInputOptions(
          response.map(({ name, federalId }) => ({
            label: name,
            value: federalId,
          })),
        );
      })
      .catch(() => {
        makeToast(
          'error',
          'Ocorreu um erro inesperado ao buscar os segurados.',
        );
      })
      .finally(() => setLoadingOptions(false));
  };

  const handleOptionSelection = (selectedOption: SearchOptions) => {
    const { value } = selectedOption;
    if (userType === UserTypeEnum.POLICYHOLDER) {
      setInputOptions(prevInputOptions =>
        prevInputOptions.filter(opt => opt.value === value),
      );
    }
    selectInsuredCallback(value);
  };

  const handleInputBlur = () => {
    if (inputValueOnFocus && (!inputValue || inputValue.trim().length === 0)) {
      setInputValueOnFocus(undefined);
      selectInsuredCallback(null);
      if (userType === UserTypeEnum.POLICYHOLDER) {
        setInputOptions([]);
      }
    }
  };

  const handleClearClick = () => {
    setInputValue('');
    selectInsuredCallback(null);
    if (userType === UserTypeEnum.POLICYHOLDER) {
      setInputOptions([]);
    }
  };

  return (
    <div
      className={classNames(styles['process-list-insured-filter__wrapper'], {
        [styles['process-list-insured-filter__wrapper--loading']]:
          loadingOptions,
      })}
    >
      <SearchInput
        data-testid="processListInsuredFilter-input-search"
        variant="medium"
        icon={loadingOptions ? 'loading' : 'search'}
        label="Busque pelo nome do segurado"
        placeholder="Busque pelo nome do segurado"
        value={inputValue}
        options={
          userType !== UserTypeEnum.POLICYHOLDER
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
          data-testid="processListInsuredFilter-btn-clear"
          label="Limpar busca"
          onClick={() => handleClearClick()}
        />
      )}
    </div>
  );
};

export default ProcessListInsuredFilter;

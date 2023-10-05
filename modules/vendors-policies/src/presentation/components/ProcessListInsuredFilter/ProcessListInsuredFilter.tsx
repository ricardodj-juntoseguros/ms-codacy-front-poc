import { useEffect, useMemo, useState } from 'react';
import { VendorsAuthService } from '@services';
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
  const [inputValue, setInputValue] = useState<string>();
  const [inputValueOnFocus, setInputValueOnFocus] = useState<string>();
  const [inputOptions, setInputOptions] = useState<SearchOptions[]>([]);
  const [loadingOptions, setLoadingOptions] = useState<boolean>(false);
  const userType = VendorsAuthService.getUserType();

  useEffect(() => {
    if (userType === 'insured') {
      fetchInsuredOptionsForInsuredUserType();
    }
  }, [userType]);

  const filteredInputOptions = useMemo(() => {
    if (!inputValue) return null;
    return inputOptions.filter(({ label }) => {
      return (
        label.toLowerCase().includes(inputValue.toLowerCase()) ||
        label === inputValue
      );
    });
  }, [inputValue, inputOptions]);

  const fetchInsuredOptionsForInsuredUserType = () => {
    setLoadingOptions(true);
    ProcessListingApi.getInsuredOptionsForInsuredUser()
      .then(response => {
        setInputOptions(
          response.map(({ name, federalId }) => ({
            label: name,
            value: federalId,
          })),
        );
      })
      .catch(error => makeToast('error', error))
      .finally(() => setLoadingOptions(false));
  };

  const handleOptionSelection = (selectedOption: SearchOptions) => {
    const { label, value } = selectedOption;
    setInputValue(label);
    selectInsuredCallback(value);
  };

  const handleInputBlur = () => {
    if (inputValueOnFocus && (!inputValue || inputValue.trim().length === 0)) {
      setInputValueOnFocus(undefined);
      selectInsuredCallback(null);
    }
  };

  const handleClearClick = () => {
    setInputValue('');
    selectInsuredCallback(null);
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
        options={filteredInputOptions || inputOptions}
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

import { useState, useEffect } from 'react';
import { Dropdown, DropdownOptions, LinkButton } from 'junto-design-system';
import { PROCESS_STATUS } from '../../../constants';
import ProcessListingApi from '../../../application/features/processListing/ProcessListingApi';
import styles from './ProcessListStatusFilter.module.scss';

interface ProcessListStatusFilterProps {
  changeStatusValueCallback: (value: number) => void;
  showClearButton: boolean;
}

const ProcessListStatusFilter: React.FC<ProcessListStatusFilterProps> = ({
  changeStatusValueCallback,
  showClearButton,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>('-1');
  const [statusOptions, setStatusOptions] = useState<DropdownOptions[]>([
    {
      label: 'Todos',
      value: '-1',
    },
  ]);

  useEffect(() => {
    ProcessListingApi.getStatusFilterOptions().then(response => {
      const mappedOptions = response.map(opt => ({
        label:
          PROCESS_STATUS.find(processStatus => processStatus.id === opt.value)
            ?.cardTagLabel || '',
        value: `${opt.value}`,
      }));
      setStatusOptions(prevStatusOptions => [
        ...prevStatusOptions,
        ...mappedOptions,
      ]);
    });
  }, []);

  const handleClearClick = () => {
    setSelectedValue('-1');
    changeStatusValueCallback(-1);
  };

  return (
    <div className={styles['process-list-status-filter__wrapper']}>
      <Dropdown
        data-testid="processListStatusFilter-dropdown"
        variant="medium"
        options={statusOptions}
        value={statusOptions.find(opt => opt.value === selectedValue) || null}
        onValueSelected={option => {
          setSelectedValue(option.value);
          changeStatusValueCallback(Number.parseInt(option.value, 10));
        }}
      />
      {showClearButton && (
        <LinkButton
          data-testid="processListStatusFilter-btn-clear"
          label="Limpar busca"
          onClick={() => handleClearClick()}
        />
      )}
    </div>
  );
};

export default ProcessListStatusFilter;

import { useMemo, useState } from 'react';
import classNames from 'classnames';
import { Dropdown } from 'junto-design-system';
import { UserTypeEnum } from '@services';
import { PROCESS_FILTERS } from '../../../constants';
import { ProcessListFilterParams } from '../../../application/types/model';
import styles from './ProcessListFilters.module.scss';
import ProcessListProcessFilter from '../ProcessListProcessFilter';
import ProcessListStatusFilter from '../ProcessListStatusFilter';
import ProcessListInsuredFilter from '../ProcessListInsuredFilter';
import ProcessListPolicyholderFilter from '../ProcessListPolicyholderFilter';

interface ProcessListFiltersProps {
  isLoadingProcesses: boolean;
  currentFilters: ProcessListFilterParams;
  userType: UserTypeEnum | null;
  onChangeFilterValueCallback: (
    filterType: string,
    filterValue: string | null,
  ) => void;
  onChangeFilterTypeCallback: () => void;
}

const ProcessListFilters: React.FC<ProcessListFiltersProps> = ({
  isLoadingProcesses,
  currentFilters,
  userType,
  onChangeFilterValueCallback,
  onChangeFilterTypeCallback,
}) => {
  const [currentOption, setCurrentOption] = useState<string>('process');

  const filterOptions = useMemo(() => {
    if (userType === null) return [];
    return PROCESS_FILTERS[userType];
  }, [userType]);

  const renderFilterInput = () => {
    switch (currentOption) {
      case 'process':
        return (
          <ProcessListProcessFilter
            isLoadingProcesses={isLoadingProcesses}
            showClearButton={!!currentFilters.identification}
            changeProcessValueCallback={value =>
              onChangeFilterValueCallback(currentOption, value)
            }
          />
        );
      case 'status':
        return (
          <ProcessListStatusFilter
            showClearButton={!!currentFilters.status}
            changeStatusValueCallback={value => {
              onChangeFilterValueCallback(currentOption, `${value}`);
            }}
          />
        );
      case 'policyholder':
        return (
          <ProcessListPolicyholderFilter
            showClearButton={!!currentFilters.policyholderFederalId}
            selectPolicyholderCallback={value => {
              onChangeFilterValueCallback(currentOption, value);
            }}
          />
        );
      default:
      case 'insured':
        return (
          <ProcessListInsuredFilter
            showClearButton={!!currentFilters.insuredFederalId}
            selectInsuredCallback={value => {
              onChangeFilterValueCallback(currentOption, value);
            }}
          />
        );
        return null;
    }
  };

  const isClearButtonVisible =
    !!currentFilters.identification ||
    !!currentFilters.insuredFederalId ||
    !!currentFilters.policyholderFederalId ||
    !!currentFilters.status;

  return (
    <div
      className={classNames(styles['process-list-filters__wrapper'], {
        [styles['process-list-filters__wrapper--applied']]:
          isClearButtonVisible,
      })}
    >
      <div>
        <Dropdown
          data-testid="processListFilters-dropdown"
          variant="medium"
          value={
            filterOptions.find(filter => filter.value === currentOption) || null
          }
          options={filterOptions}
          onValueSelected={selectedFilter => {
            setCurrentOption(selectedFilter.value);
            onChangeFilterTypeCallback();
          }}
        />
      </div>
      <div>{renderFilterInput()}</div>
    </div>
  );
};

export default ProcessListFilters;

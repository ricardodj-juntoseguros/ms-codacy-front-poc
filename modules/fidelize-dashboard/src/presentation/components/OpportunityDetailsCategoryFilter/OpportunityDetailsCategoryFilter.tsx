import { CheckboxMultiselect } from 'junto-design-system';
import { useDispatch, useSelector } from 'react-redux';
import classnames from 'classnames';
import {
  ModalityEnum,
  OpportunitiesDetailsFilterModel,
} from '../../../application/types/model';
import {
  opportunitiesDetailsActions,
  selectFilterValues,
} from '../../../application/features/opportunitiesDetails/OpportunitiesDetailsSlice';
import styles from './OpportunityDetailsCategoryFilter.module.scss';

interface OpportunityDetailsCategoryFilterProps {
  modality: ModalityEnum;
}

const OpportunityDetailsCategoryFilter: React.FC<OpportunityDetailsCategoryFilterProps> =
  ({ modality }) => {
    const dispatch = useDispatch();
    const filterValue = useSelector(
      selectFilterValues(modality, 'category'),
    ) as string[] | null;

    const handleMultiselectApply = (selection: string[]) => {
      const filter: OpportunitiesDetailsFilterModel = {
        key: 'category',
        values: selection,
      };
      dispatch(opportunitiesDetailsActions.setFilter({ modality, filter }));
    };

    return (
      <div
        data-testid={`${modality}-category-filter`}
        className={classnames(
          styles['opportunity-details-category-filter__wrapper'],
          {
            [styles['opportunity-details-category-filter__wrapper--applied']]:
              filterValue !== null && (filterValue || []).length > 0,
          },
        )}
      >
        <CheckboxMultiselect
          id={`${modality}-category-filter`}
          options={[
            { value: 'BC', label: 'Bloqueio de conta', disabled: false },
            { value: 'DJ', label: 'Depósito judicial', disabled: false },
            { value: 'FB', label: 'Fiança bancária', disabled: false },
            { value: 'PE', label: 'Penhora', disabled: false },
            { value: 'NE', label: 'Nova emissão', disabled: false },
            { value: 'RE', label: 'Renovação', disabled: false },
          ]}
          initialSelection={filterValue || []}
          variant="medium"
          inputValue="Tipo"
          showActionButtons
          onApplySelection={handleMultiselectApply}
          closeOnApply
        />
      </div>
    );
  };

export default OpportunityDetailsCategoryFilter;

import { CheckboxMultiselect } from 'junto-design-system';
import { useDispatch, useSelector } from 'react-redux';
import TagManager from 'react-gtm-module';
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
import { MODALITIES_IDS } from '../../../constants';

interface OpportunityDetailsCategoryFilterProps {
  modality: ModalityEnum;
  options: { value: string; label: string }[];
}

const OpportunityDetailsCategoryFilter: React.FC<OpportunityDetailsCategoryFilterProps> =
  ({ modality, options }) => {
    const FILTER_TYPE = 'category';
    const dispatch = useDispatch();
    const filterValue = useSelector(
      selectFilterValues(modality, 'category'),
    ) as string[] | null;

    const handleMultiselectApply = (selection: string[]) => {
      const filter: OpportunitiesDetailsFilterModel = {
        key: FILTER_TYPE,
        values: selection,
      };
      dispatch(opportunitiesDetailsActions.setFilter({ modality, filter }));
      if (selection.length > 0) {
        TagManager.dataLayer({
          dataLayer: {
            event: 'ClickApplyOpportunityListFilterButton',
            modalityId: MODALITIES_IDS[modality],
            filterType: FILTER_TYPE,
            selectedFilters: selection,
          },
        });
      }
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
          options={options.map(opt => {
            const { label, value } = opt;
            return { label, value, disabled: false };
          })}
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

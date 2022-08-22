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
import styles from './OpportunityDetailsMultiselectFilter.module.scss';
import { MODALITIES_IDS } from '../../../constants';

interface OpportunityDetailsMultiselectFilterProps {
  filterName: string;
  modality: ModalityEnum;
  options: { value: string; label: string }[];
}

const OpportunityDetailsMultiselectFilter: React.FC<OpportunityDetailsMultiselectFilterProps> =
  ({ filterName, modality, options }) => {
    const dispatch = useDispatch();
    const filterValue = useSelector(
      selectFilterValues(modality, filterName),
    ) as string[] | null;

    const handleMultiselectApply = (selection: string[]) => {
      const filter: OpportunitiesDetailsFilterModel = {
        key: filterName,
        values: selection,
      };
      dispatch(opportunitiesDetailsActions.setFilter({ modality, filter }));
      if (selection.length > 0) {
        TagManager.dataLayer({
          dataLayer: {
            event: 'ClickApplyOpportunityListFilterButton',
            modalityId: MODALITIES_IDS[modality],
            filterType: filterName,
            selectedFilters: selection,
          },
        });
      }
    };

    const getInputValueByFilterName = (filterName: string) => {
      switch (filterName) {
        case 'category':
          return 'Tipo';
        case 'relevance':
          return 'Relevância';
        default:
          return undefined;
      }
    };

    return (
      <div
        data-testid={`${modality}-${filterName}-filter`}
        className={classnames(
          styles['opportunity-details-multiselect-filter__wrapper'],
          {
            [styles[
              'opportunity-details-multiselect-filter__wrapper--applied'
            ]]: filterValue !== null && (filterValue || []).length > 0,
          },
        )}
      >
        <CheckboxMultiselect
          id={`${modality}-${filterName}-filter`}
          options={options.map(opt => {
            const { label, value } = opt;
            return { label, value, disabled: false };
          })}
          initialSelection={filterValue || []}
          variant="medium"
          inputValue={getInputValueByFilterName(filterName)}
          showActionButtons
          onApplySelection={handleMultiselectApply}
          closeOnApply
        />
      </div>
    );
  };

export default OpportunityDetailsMultiselectFilter;

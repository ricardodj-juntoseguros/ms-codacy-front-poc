import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { LinkButton } from 'junto-design-system';
import { ModalityEnum } from '../../../application/types/model';
import {
  selectFiltersByModality,
  opportunitiesDetailsActions,
} from '../../../application/features/opportunitiesDetails/OpportunitiesDetailsSlice';
import OpportunityDetailsCategoryFilter from '../OpportunityDetailsCategoryFilter';
import styles from './OpportunityDetailsListFilters.module.scss';

interface OpportunityDetailsListFiltersProps {
  modality: ModalityEnum;
}

const FILTERS_BY_MODALITY = [
  {
    modality: ModalityEnum.TRABALHISTA,
    filters: [{ key: 'category', component: OpportunityDetailsCategoryFilter }],
  },
];

const OpportunityDetailsListFilters: React.FC<OpportunityDetailsListFiltersProps> =
  ({ modality }) => {
    const dispatch = useDispatch();
    const filters = useSelector(selectFiltersByModality(modality));
    const [open, setOpen] = useState(false);

    const filtersToRender = FILTERS_BY_MODALITY.find(
      each => each.modality === modality,
    );

    const hasAppliedAnyFilter = useMemo(() => {
      return (
        filters.length > 0 &&
        !!filters.find(f => {
          if (!f.values) return false;
          if (Object.keys(f.values).length === 0) return false;
          return true;
        })
      );
    }, [filters]);

    const handleClearAllClick = () => {
      dispatch(opportunitiesDetailsActions.clearFiltersByModality(modality));
    };

    if (!filtersToRender) return null;
    return (
      <div className={styles['opportunity-details-list-filters__wrapper']}>
        <div>
          <LinkButton
            label="Filtros"
            icon="filter"
            iconPosition="right"
            onClick={() => setOpen(!open)}
          />
          {hasAppliedAnyFilter && !open && (
            <span
              className={
                styles['opportunity-details-list-filters__applied-badge']
              }
            />
          )}
        </div>
        <div
          className={classNames(
            styles['opportunity-details-list-filters__container'],
            {
              [styles['opportunity-details-list-filters__container--open']]:
                open,
            },
          )}
        >
          <div>
            {filtersToRender.filters.map(filter => {
              const { key, component: Component } = filter;
              return <Component key={key} modality={modality} />;
            })}
          </div>
          <div>
            {hasAppliedAnyFilter && (
              <LinkButton
                data-testid="btn-clear-all-filters"
                size="small"
                label="Limpar tudo"
                onClick={() => handleClearAllClick()}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

export default OpportunityDetailsListFilters;

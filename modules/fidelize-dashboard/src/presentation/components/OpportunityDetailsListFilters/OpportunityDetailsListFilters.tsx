import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { LinkButton } from 'junto-design-system';
import { ModalityEnum } from '../../../application/types/model';
import { OpportunitiesFilterOptionsDTO } from '../../../application/types/dto';
import {
  selectFiltersByModality,
  opportunitiesDetailsActions,
} from '../../../application/features/opportunitiesDetails/OpportunitiesDetailsSlice';
import OpportunitiesDetailsApi from '../../../application/features/opportunitiesDetails/OpportunitiesDetailsApi';
import OpportunityDetailsMultiselectFilter from '../OpportunityDetailsMultiselectFilter';
import styles from './OpportunityDetailsListFilters.module.scss';
import { hasAppliedAnyFilter } from '../../../helpers';

interface OpportunityDetailsListFiltersProps {
  modality: ModalityEnum;
}

const FILTERS_BY_MODALITY = [
  {
    modality: ModalityEnum.TRABALHISTA,
    filters: [
      {
        name: 'relevance',
        component: OpportunityDetailsMultiselectFilter,
        useOptions: true,
      },
      {
        name: 'category',
        component: OpportunityDetailsMultiselectFilter,
        useOptions: true,
      },
    ],
  },
];

const OpportunityDetailsListFilters: React.FC<OpportunityDetailsListFiltersProps> =
  ({ modality }) => {
    const dispatch = useDispatch();
    const filters = useSelector(selectFiltersByModality(modality));
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(false);
    const [filtersContent, setFiltersContent] = useState<
      OpportunitiesFilterOptionsDTO[]
    >([]);

    const filtersToRender = useMemo(() => {
      return FILTERS_BY_MODALITY.find(each => each.modality === modality);
    }, [modality]);

    const hasFilterApplied = useMemo(
      () => hasAppliedAnyFilter(filters),
      [filters],
    );

    useEffect(() => {
      if (filtersToRender) {
        OpportunitiesDetailsApi.getFiltersContentByModality(modality)
          .then(response => {
            setFiltersContent(response.filters);
            setError(false);
          })
          .catch(() => setError(true));
      }
    }, [modality, filtersToRender]);

    const handleClearAllClick = () => {
      dispatch(opportunitiesDetailsActions.clearFiltersByModality(modality));
    };

    const getFilterOptions = (filterName: string) => {
      const foundFilter = filtersContent.find(
        filter => filter.filterName === filterName,
      );
      if (!foundFilter) return null;
      return foundFilter.options;
    };

    if (!filtersToRender) return null;
    if (error)
      return (
        <div className={styles['opportunity-details-list-filters__error']}>
          Ocorreu um erro ao carregar os filtros das oportunidades.
        </div>
      );
    return (
      <div className={styles['opportunity-details-list-filters__wrapper']}>
        <div>
          <LinkButton
            label="Filtros"
            icon="filter"
            iconPosition="right"
            onClick={() => setOpen(!open)}
          />
          {hasFilterApplied && !open && (
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
              const { name, component: Component, useOptions } = filter;
              const props = { filterName: name, modality } as any;
              if (useOptions) {
                props.options = getFilterOptions(name) || [];
              }
              return <Component key={name} {...props} />;
            })}
          </div>
          <div>
            {hasFilterApplied && (
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

import { OpportunitiesDetailsFilterModel } from '../application/types/model';

export const getFiltersQueryParams = (
  filters: OpportunitiesDetailsFilterModel[],
) => {
  const query = {} as any;
  filters.forEach(filter => {
    const filterName = filter.key;
    switch (filterName) {
      case 'category':
      case 'relevance':
        if (Object.keys(filter.values).length !== 0) {
          const fieldName =
            filterName === 'category' ? 'categories' : 'relevances';
          query[fieldName] = (filter.values as string[]).join(',');
        }
        break;
      case 'securityAmount':
        if (filter.values) {
          const filterValue = filter.values as {
            min: number | null;
            max: number | null;
          };
          if (filterValue.max && filterValue.max > 0)
            query.maxSecurityAmount = filterValue.max;
          if (filterValue.min && filterValue.min > 0)
            query.minSecurityAmount = filterValue.min;
        }
        break;
      default:
        break;
    }
  });
  return query;
};

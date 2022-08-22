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
      default:
        break;
    }
  });
  return query;
};

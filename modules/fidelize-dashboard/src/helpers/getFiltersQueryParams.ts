import { OpportunitiesDetailsFilterModel } from '../application/types/model';

export const getFiltersQueryParams = (
  filters: OpportunitiesDetailsFilterModel[],
) => {
  const query = {} as any;
  filters.forEach(filter => {
    const filterName = filter.key;
    switch (filterName) {
      case 'category':
        if (Object.keys(filter.values).length !== 0) {
          query.categories = (filter.values as string[]).join(',');
        }
        break;
      default:
        break;
    }
  });
  return query;
};

import { OpportunitiesDetailsFilterModel } from '../application/types/model';

export const hasAppliedAnyFilter = (
  filters: OpportunitiesDetailsFilterModel[],
) => {
  return (
    filters.length > 0 &&
    !!filters.find(f => {
      if (Object.keys(f.values).length === 0) return false;
      return true;
    })
  );
};

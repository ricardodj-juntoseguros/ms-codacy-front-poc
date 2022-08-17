import { OpportunitiesDetailsFilterModel } from '../application/types/model';
import { hasAppliedAnyFilter } from './hasAppliedAnyFilter';

describe('Has Applied any Filter Helper', () => {
  it('Should return true if any of the filters passed has values applied', () => {
    const mockFilters: OpportunitiesDetailsFilterModel[] = [
      { key: 'test1', values: ['1', '2', '3'] },
    ];
    const result = hasAppliedAnyFilter(mockFilters);
    expect(result).toBeTruthy();
  });

  it('Should return false if none of the filters passed has values applied', () => {
    const mockFilters: OpportunitiesDetailsFilterModel[] = [
      { key: 'test1', values: [] },
    ];
    const result = hasAppliedAnyFilter(mockFilters);
    expect(result).toBeFalsy();
  });
});

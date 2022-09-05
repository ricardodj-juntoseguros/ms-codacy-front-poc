import { OpportunitiesDetailsFilterModel } from '../application/types/model';
import { getFiltersQueryParams } from './getFiltersQueryParams';

describe('Get Filters Query Params Helper', () => {
  it('Should return correct object for query with category filter', () => {
    const mockFilters: OpportunitiesDetailsFilterModel[] = [
      { key: 'category', values: ['1', '2', '3', '4'] },
    ];
    const result = getFiltersQueryParams(mockFilters);
    expect(result.categories).toBeDefined();
    expect(result.categories).toEqual('1,2,3,4');
  });

  it('Should return correct object for query with relevance filter', () => {
    const mockFilters: OpportunitiesDetailsFilterModel[] = [
      { key: 'relevance', values: ['1', '2', '3', '4'] },
    ];
    const result = getFiltersQueryParams(mockFilters);
    expect(result.relevances).toBeDefined();
    expect(result.relevances).toEqual('1,2,3,4');
  });

  it('Should return correct object for query ith securityAmount filter', () => {
    const mockFilters: OpportunitiesDetailsFilterModel[] = [
      { key: 'securityAmount', values: { min: 10000, max: 20000 } },
    ];
    const result = getFiltersQueryParams(mockFilters);
    expect(result.maxSecurityAmount).toBeDefined();
    expect(result.minSecurityAmount).toBeDefined();
    expect(result.maxSecurityAmount).toEqual(20000);
    expect(result.minSecurityAmount).toEqual(10000);
  });

  it('Should return empty object for not mapped filternames', () => {
    const mockFilters: OpportunitiesDetailsFilterModel[] = [
      { key: 'any_key', values: ['1', '2', '3', '4'] },
    ];
    const result = getFiltersQueryParams(mockFilters);
    expect(result).toStrictEqual({});
  });
});

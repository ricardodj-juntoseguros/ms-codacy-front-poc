export interface OpportunitiesDetailsFilterModel {
  key: string;
  values: string[] | { min: number | null; max: number | null };
}

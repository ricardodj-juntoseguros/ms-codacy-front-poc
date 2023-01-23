export interface OpportunitiesDetailsFilterModel {
  key: string;
  values:
    | string[]
    | { min: number | string | null; max: number | string | null };
}

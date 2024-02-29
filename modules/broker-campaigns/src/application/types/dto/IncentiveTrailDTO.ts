import { IncentiveTrailStepDTO } from './IncentiveTrailStepDTO';

export interface IncentiveTrailDTO {
  valueAccumulation: number;
  conquests: IncentiveTrailStepDTO[];
  dateProduction: string;
}

import { IncentiveTrailStep } from './IncentiveTrailStep';

export interface IncentiveTrail {
  accumulatedValue: string;
  steps: IncentiveTrailStep[];
  lastUpdate: string;
}

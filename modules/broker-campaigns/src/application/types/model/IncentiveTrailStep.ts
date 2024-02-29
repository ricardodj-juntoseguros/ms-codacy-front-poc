import { IncentiveTrailStepStatusEnum } from './IncentiveTrailStepStatusEnum';

export interface IncentiveTrailStep {
  stepBonusValue: string;
  productionGoal: string;
  stepPercentage: number;
  status: IncentiveTrailStepStatusEnum;
  valueLeft: string;
  expirationDate: string | null;
}

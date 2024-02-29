import { format } from 'date-fns';
import {
  IncentiveTrail,
  IncentiveTrailStepStatusEnum,
} from '../application/types/model';

export const NO_ACCEPT_LIST_VALUES: IncentiveTrail = {
  accumulatedValue: 'R$ 0,00',
  steps: [
    {
      stepBonusValue: 'R$ -',
      productionGoal: 'R$ -',
      stepPercentage: 0,
      status: IncentiveTrailStepStatusEnum.unavailable,
      valueLeft: 'R$ -',
      expirationDate: '',
    },
    {
      stepBonusValue: 'R$ -',
      productionGoal: 'R$ -',
      stepPercentage: 0,
      status: IncentiveTrailStepStatusEnum.unavailable,
      valueLeft: 'R$ -',
      expirationDate: '',
    },
    {
      stepBonusValue: 'R$ -',
      productionGoal: 'R$ -',
      stepPercentage: 0,
      status: IncentiveTrailStepStatusEnum.unavailable,
      valueLeft: 'R$ -',
      expirationDate: '',
    },
    {
      stepBonusValue: 'R$ -',
      productionGoal: 'R$ -',
      stepPercentage: 0,
      status: IncentiveTrailStepStatusEnum.unavailable,
      valueLeft: 'R$ -',
      expirationDate: '',
    },
    {
      stepBonusValue: 'R$ -',
      productionGoal: 'R$ -',
      stepPercentage: 0,
      status: IncentiveTrailStepStatusEnum.unavailable,
      valueLeft: 'R$ -',
      expirationDate: '',
    },
  ],
  lastUpdate: format(new Date(), "dd/MM/yyyy 'às' HH'h'mm"),
};

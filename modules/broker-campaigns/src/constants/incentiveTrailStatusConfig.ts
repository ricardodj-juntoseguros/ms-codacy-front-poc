import { IncentiveTrailStepStatusEnum } from '../application/types/model';

export const INCENTIVE_TRAIL_STATUS_CONFIG = {
  [IncentiveTrailStepStatusEnum.available]: {
    label: 'RESGATE ATÉ',
    icon: 'icon-dollar-sign',
  },
  [IncentiveTrailStepStatusEnum.expired]: {
    label: 'BÔNUS EXPIRADO EM',
    icon: 'icon-slash',
  },
  [IncentiveTrailStepStatusEnum.paid]: {
    label: 'RESGATE REALIZADO',
    icon: 'icon-check-circle',
  },
  [IncentiveTrailStepStatusEnum.unavailable]: {
    label: 'FALTAM APENAS',
    icon: 'icon-info',
  },
};

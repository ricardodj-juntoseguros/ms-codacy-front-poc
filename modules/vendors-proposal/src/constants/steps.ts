import { StepComponentModel, StepStatusEnum } from '../application/types/model';
import ContractData from '../presentation/components/ContractData/ContractData';

export const COMMON_PROPOSAL_STEPS: StepComponentModel[] = [
  {
    name: 'ContractData',
    status: StepStatusEnum.EDITABLE,
    component: ContractData,
    title: {
      text: 'Olá. Para iniciar uma nova solicitação de garantia, comece preenchendo os %STRONG%',
      boldWords: ['dados do contrato.'],
    },
  },
];

export const SPECIFIC_PROPOSAL_STEPS: StepComponentModel[] = [];

export const ALL_PROPOSAL_STEPS: StepComponentModel[] = [
  ...COMMON_PROPOSAL_STEPS,
];

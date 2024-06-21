import { StepComponentModel, StepStatusEnum } from '../application/types/model';
import ContractData from '../presentation/components/ContractData/ContractData';
import InsuredAndPolicyholderSelection from '../presentation/components/InsuredAndPolicyholderSelection/InsuredAndPolicyholderSelection';
import PolicyholderContact from '../presentation/components/PolicyholderContact/PolicyholderContact';
import WarrantyData from '../presentation/components/WarrantyData/WarrantyData';

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
  {
    name: 'InsuredAndPolicyholderSelection',
    status: StepStatusEnum.HIDDEN,
    component: InsuredAndPolicyholderSelection,
    title: {
      text: 'Nessa etapa, precisamos que informe as %STRONG% participantes do contrato.',
      boldWords: ['empresas'],
    },
  },
  {
    name: 'PolicyholderContact',
    status: StepStatusEnum.HIDDEN,
    component: PolicyholderContact,
    title: {
      text: 'Agora, nos indique o melhor %STRONG% Aquele que receberá a solicitação para aprovação.',
      boldWords: ['contato da empresa contratada.'],
    },
  },
  {
    name: 'WarrantyData',
    status: StepStatusEnum.HIDDEN,
    component: WarrantyData,
    title: {
      text: 'Estamos quase lá, para finalizar, preencha os %STRONG%',
      boldWords: ['dados da garantia.'],
    },
  },
];

export const SPECIFIC_PROPOSAL_STEPS: StepComponentModel[] = [];

export const ALL_PROPOSAL_STEPS: StepComponentModel[] = [
  ...COMMON_PROPOSAL_STEPS,
];

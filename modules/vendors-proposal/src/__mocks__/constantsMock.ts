import { getComponentMock } from './getComponentMock';

const COMMON_PROPOSAL_STEPS = [
  {
    name: 'ComponentA',
    component: getComponentMock(),
    status: 'editable',
    title: {
      text: 'Olá. Para iniciar uma nova solicitação de garantia, comece preenchendo os %STRONG%',
      boldWords: ['dados do contrato.'],
    },
  },
  {
    name: 'ComponentB',
    component: getComponentMock(),
    status: 'hidden',
    title: {
      text: 'Nessa etapa, precisamos que informe as %STRONG% participantes do contrato.',
      boldWords: ['empresas'],
    },
  },
];

export const constantsMock = {
  COMMON_PROPOSAL_STEPS,
  ALL_PROPOSAL_STEPS: [...COMMON_PROPOSAL_STEPS],
};

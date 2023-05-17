import { StepStatusEnum } from '../application/types/model';

export const storeMock = {
  flow: {
    steps: [
      {
        name: 'ComponentA',
        status: StepStatusEnum.EDITABLE,
        title: {
          text: 'Olá. Para iniciar uma nova solicitação de garantia, comece preenchendo os %STRONG%',
          boldWords: ['dados do contrato.'],
        },
        infoText: 'Component',
      },
      {
        name: 'ComponentB',
        status: StepStatusEnum.HIDDEN,
        title: {
          text: 'Nessa etapa, precisamos que informe as %STRONG% participantes do contrato.',
          boldWords: ['empresas'],
        },
      },
    ],
  },
};

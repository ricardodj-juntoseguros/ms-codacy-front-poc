import { StepComponentModel, StepStatusEnum } from '../application/types/model';
import { getStepList } from './getStepList';


const Component = () => {
  return (<h1>Component</h1>);
}

describe('getStepList Helper', () => {
  const stepsMock: StepComponentModel[] = [
    {
      name: 'ComponentA',
      component: Component,
      status: StepStatusEnum.EDITABLE,
      title: {
        text: 'Olá. Para iniciar uma nova solicitação de garantia, comece preenchendo os %STRONG%',
        boldWords: ['dados do contrato.'],
      },
    },
    {
      name: 'ComponentB',
      component: Component,
      status: StepStatusEnum.HIDDEN,
      title: {
        text: 'Nessa etapa, precisamos que informe as %STRONG% participantes do contrato.',
        boldWords: ['empresas'],
      },
    },
  ];

  it('should return steps', async () => {
    const steps = getStepList(stepsMock);

    expect(steps).toEqual([
      {
        name: 'ComponentA',
        title: {
          text: 'Olá. Para iniciar uma nova solicitação de garantia, comece preenchendo os %STRONG%',
          boldWords: ['dados do contrato.'],
        },
        infoText: undefined,
        status: StepStatusEnum.EDITABLE,
      },
      {
        name: 'ComponentB',
        title: {
          text: 'Nessa etapa, precisamos que informe as %STRONG% participantes do contrato.',
          boldWords: ['empresas'],
        },
        infoText: undefined,
        status: StepStatusEnum.HIDDEN,
      },
    ]);
  });
});

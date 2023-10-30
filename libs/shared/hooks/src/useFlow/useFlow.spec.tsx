import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react-hooks';
import { FlowProvider, useFlow } from './useFlow';
import { StepStatusEnum } from './enums';
import { StepComponentModel } from './types';

describe('useFlow', () => {
  const Component = () => {
    return <h1>Component</h1>;
  };

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
  const stepsMockResult = [
    {
      name: 'ComponentA',
      status: StepStatusEnum.EDITABLE,
      title: {
        text: 'Olá. Para iniciar uma nova solicitação de garantia, comece preenchendo os %STRONG%',
        boldWords: ['dados do contrato.'],
      },
    },
    {
      name: 'ComponentB',
      status: StepStatusEnum.HIDDEN,
      title: {
        text: 'Nessa etapa, precisamos que informe as %STRONG% participantes do contrato.',
        boldWords: ['empresas'],
      },
    },
  ];

  it('should insert the steps within the state', async () => {
    const wrapper = ({ children }: any) => (
      <FlowProvider
        allSteps={stepsMock}
        initialSteps={[]}
        showFinishedSteps={false}
      >
        {children}
      </FlowProvider>
    );
    const { result } = renderHook(() => useFlow(), { wrapper });
    result.current.setSteps(stepsMockResult);
    expect(result.current.steps).toEqual(stepsMockResult);
  });

  it('should proceed to the next step', async () => {
    const wrapper = ({ children }: any) => (
      <FlowProvider
        allSteps={stepsMock}
        initialSteps={stepsMockResult}
        showFinishedSteps={false}
      >
        {children}
      </FlowProvider>
    );
    const { result } = renderHook(() => useFlow(), { wrapper });
    result.current.advanceStep('ComponentA', 'test');
    expect(result.current.steps[0]).toEqual({
      name: 'ComponentA',
      status: StepStatusEnum.FINISHED,
      title: {
        text: 'Olá. Para iniciar uma nova solicitação de garantia, comece preenchendo os %STRONG%',
        boldWords: ['dados do contrato.'],
      },
      infoText: 'test',
    });
    expect(result.current.steps[1]).toEqual({
      name: 'ComponentB',
      status: StepStatusEnum.EDITABLE,
      title: {
        text: 'Nessa etapa, precisamos que informe as %STRONG% participantes do contrato.',
        boldWords: ['empresas'],
      },
    });
  });

  it('should change the status of a step to editable', async () => {
    const updatedStepResultMock = [
      {
        name: 'ComponentA',
        status: StepStatusEnum.FINISHED,
        title: {
          text: 'Olá. Para iniciar uma nova solicitação de garantia, comece preenchendo os %STRONG%',
          boldWords: ['dados do contrato.'],
        },
      },
      {
        name: 'ComponentB',
        status: StepStatusEnum.FINISHED,
        title: {
          text: 'Nessa etapa, precisamos que informe as %STRONG% participantes do contrato.',
          boldWords: ['empresas'],
        },
      },
      {
        name: 'ComponentC',
        status: StepStatusEnum.FINISHED,
        title: {
          text: 'Nessa etapa, precisamos que informe as %STRONG% participantes do contrato.',
          boldWords: ['empresas'],
        },
      },
    ];
    const wrapper = ({ children }: any) => (
      <FlowProvider
        allSteps={stepsMock}
        initialSteps={updatedStepResultMock}
        showFinishedSteps={false}
      >
        {children}
      </FlowProvider>
    );
    const { result } = renderHook(() => useFlow(), { wrapper });
    result.current.setEditableStep('ComponentB');
    expect(result.current.steps[0]).toEqual({
      name: 'ComponentA',
      status: StepStatusEnum.FINISHED,
      title: {
        text: 'Olá. Para iniciar uma nova solicitação de garantia, comece preenchendo os %STRONG%',
        boldWords: ['dados do contrato.'],
      },
    });
    expect(result.current.steps[1]).toEqual({
      name: 'ComponentB',
      status: StepStatusEnum.EDITABLE,
      title: {
        text: 'Nessa etapa, precisamos que informe as %STRONG% participantes do contrato.',
        boldWords: ['empresas'],
      },
    });
    expect(result.current.steps[2]).toEqual({
      name: 'ComponentC',
      status: StepStatusEnum.HIDDEN,
      title: {
        text: 'Nessa etapa, precisamos que informe as %STRONG% participantes do contrato.',
        boldWords: ['empresas'],
      },
    });
  });

  it('should change the title of a step', async () => {
    const wrapper = ({ children }: any) => (
      <FlowProvider
        allSteps={stepsMock}
        initialSteps={stepsMockResult}
        showFinishedSteps={false}
      >
        {children}
      </FlowProvider>
    );
    const { result } = renderHook(() => useFlow(), { wrapper });
    result.current.setTitle('ComponentA', 'title', []);
    expect(result.current.steps[0]).toEqual({
      name: 'ComponentA',
      status: StepStatusEnum.FINISHED,
      title: {
        text: 'title',
        boldWords: [],
      },
      infoText: 'test',
    });
  });
});

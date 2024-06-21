import { store } from '../../../config/store';
import { StepStatusEnum } from '../../types/model';
import { flowActions } from './FlowSlice';

describe('FlowSlice', () => {
  const stepsMock = [
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

  beforeEach(async () => {
    jest.clearAllMocks();
    await store.dispatch(flowActions.setSteps(stepsMock));
  });

  it('should set the steps correctly', async () => {
    await store.dispatch(flowActions.setSteps(stepsMock));
    const { flow } = store.getState();

    expect(flow.steps).toMatchObject(stepsMock);
  });

  it('should set the title step correctly', async () => {
    await store.dispatch(
      flowActions.setTitle({
        name: 'ComponentA',
        text: 'Title',
        boldWords: [],
      }),
    );
    const { flow } = store.getState();

    expect(flow.steps[0].title.text).toEqual('Title');
    expect(flow.steps[0].title.boldWords).toEqual([]);
    expect(flow.steps[1].title.text).toEqual(
      'Nessa etapa, precisamos que informe as %STRONG% participantes do contrato.',
    );
    expect(flow.steps[1].title.boldWords).toEqual(['empresas']);
  });

  it('should set the information text step correctly', async () => {
    await store.dispatch(
      flowActions.setInfoText({
        name: 'ComponentA',
        text: 'Information Text',
      }),
    );
    const { flow } = store.getState();

    expect(flow.steps[0].infoText).toEqual('Information Text');
    expect(flow.steps[1].infoText).toEqual(undefined);
  });

  it('should set the information text step correctly', async () => {
    await store.dispatch(
      flowActions.setInfoText({
        name: 'ComponentA',
        text: 'Information Text',
      }),
    );
    const { flow } = store.getState();

    expect(flow.steps[0].infoText).toEqual('Information Text');
    expect(flow.steps[1].infoText).toEqual(undefined);
  });

  it('should advance the step correctly', async () => {
    await store.dispatch(flowActions.advanceStep());
    const { flow } = store.getState();

    expect(flow.steps[0].status).toEqual(StepStatusEnum.FINISHED);
    expect(flow.steps[1].status).toEqual(StepStatusEnum.EDITABLE);
  });

  it("should not change the steps if you don't have any editable", async () => {
    await store.dispatch(flowActions.advanceStep());
    let { flow } = store.getState();

    expect(flow.steps[0].status).toEqual(StepStatusEnum.FINISHED);
    expect(flow.steps[1].status).toEqual(StepStatusEnum.EDITABLE);

    await store.dispatch(flowActions.advanceStep());
    flow = store.getState().flow;

    expect(flow.steps[0].status).toEqual(StepStatusEnum.FINISHED);
    expect(flow.steps[1].status).toEqual(StepStatusEnum.FINISHED);

    await store.dispatch(flowActions.advanceStep());
    flow = store.getState().flow;

    expect(flow.steps[0].status).toEqual(StepStatusEnum.FINISHED);
    expect(flow.steps[1].status).toEqual(StepStatusEnum.FINISHED);
  });

  it('should set a step to editable correctly', async () => {
    await store.dispatch(
      flowActions.setSteps([
        ...stepsMock,
        {
          name: 'ComponentC',
          status: StepStatusEnum.HIDDEN,
          title: {
            text: 'Nessa etapa, precisamos que informe as %STRONG% participantes do contrato.',
            boldWords: ['empresas'],
          },
        },
      ]),
    );
    await store.dispatch(flowActions.advanceStep());
    let { flow } = store.getState();

    expect(flow.steps[0].status).toEqual(StepStatusEnum.FINISHED);
    expect(flow.steps[1].status).toEqual(StepStatusEnum.EDITABLE);
    expect(flow.steps[2].status).toEqual(StepStatusEnum.HIDDEN);

    await store.dispatch(flowActions.advanceStep());
    flow = store.getState().flow;

    expect(flow.steps[0].status).toEqual(StepStatusEnum.FINISHED);
    expect(flow.steps[1].status).toEqual(StepStatusEnum.FINISHED);
    expect(flow.steps[2].status).toEqual(StepStatusEnum.EDITABLE);

    await store.dispatch(flowActions.setEditableStep('ComponentB'));
    flow = store.getState().flow;

    expect(flow.steps[0].status).toEqual(StepStatusEnum.FINISHED);
    expect(flow.steps[1].status).toEqual(StepStatusEnum.EDITABLE);
    expect(flow.steps[2].status).toEqual(StepStatusEnum.HIDDEN);
  });

  it("should not change the steps if you don't have any editable", async () => {
    const newStepsMock = [
      {
        name: 'ComponentC',
        status: StepStatusEnum.HIDDEN,
        title: {
          text: 'Nessa etapa, precisamos que informe as %STRONG% participantes do contrato.',
          boldWords: ['empresas'],
        },
      },
      {
        name: 'ComponentD',
        status: StepStatusEnum.HIDDEN,
        title: {
          text: 'Nessa etapa, precisamos que informe as %STRONG% participantes do contrato.',
          boldWords: ['empresas'],
        },
      },
      {
        name: 'ComponentE',
        status: StepStatusEnum.HIDDEN,
        title: {
          text: 'Nessa etapa, precisamos que informe as %STRONG% participantes do contrato.',
          boldWords: ['empresas'],
        },
      },
    ];
    await store.dispatch(flowActions.updateSteps(newStepsMock[0]));
    let { flow } = store.getState();

    expect(flow.steps[0]).toMatchObject(stepsMock[0]);
    expect(flow.steps[1]).toMatchObject(stepsMock[1]);
    expect(flow.steps[2]).toMatchObject(newStepsMock[0]);

    await store.dispatch(
      flowActions.updateSteps([newStepsMock[1], newStepsMock[2]]),
    );
    flow = store.getState().flow;

    expect(flow.steps[0]).toMatchObject(stepsMock[0]);
    expect(flow.steps[1]).toMatchObject(stepsMock[1]);
    expect(flow.steps[2]).toMatchObject(newStepsMock[0]);
    expect(flow.steps[3]).toMatchObject(newStepsMock[1]);
    expect(flow.steps[4]).toMatchObject(newStepsMock[2]);
  });
});

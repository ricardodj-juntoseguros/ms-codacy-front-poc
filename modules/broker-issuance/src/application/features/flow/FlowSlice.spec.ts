import { store } from '../../../config/store';
import { flowSliceActions } from './FlowSlice';
import { storeMock } from '../../../__mocks__';

describe('FlowSlice', () => {
  beforeEach(() => {
    store.dispatch(flowSliceActions.setSteps(storeMock.flow.steps));
  });

  it('should set steps correctly', () => {
    const { flow } = store.getState();

    expect(flow).toEqual(storeMock.flow);
  });

  it('should advance the step correctly', () => {
    store.dispatch(flowSliceActions.advanceStep({ name: 'Search' }));
    const { flow } = store.getState();

    expect(flow.steps[0].isActive).toEqual(false);
    expect(flow.steps[0].isCompleted).toEqual(true);
    expect(flow.steps[1].isActive).toEqual(true);
  });

  it('should step back correctly', () => {
    store.dispatch(flowSliceActions.advanceStep({ name: 'Search' }));
    store.dispatch(flowSliceActions.goBackStep({ name: 'CoverageData' }));
    const { flow } = store.getState();

    expect(flow.steps[0].isActive).toEqual(true);
    expect(flow.steps[1].isActive).toEqual(false);
    expect(flow.steps[1].isCompleted).toEqual(false);
  });

  it('should set step status correctly', () => {
    store.dispatch(
      flowSliceActions.setStepStatus({
        name: 'CoverageData',
        isVisible: true,
        isEnabled: true,
        isLoading: false,
      }),
    );
    const { flow } = store.getState();

    expect(flow.steps[1].isVisible).toEqual(true);
    expect(flow.steps[1].isEnabled).toEqual(true);
    expect(flow.steps[1].isLoading).toEqual(false);
  });
});

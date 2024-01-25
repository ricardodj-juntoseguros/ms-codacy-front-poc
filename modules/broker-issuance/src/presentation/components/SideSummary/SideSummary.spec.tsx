import '@testing-library/jest-dom';
import { FlowProvider, StepStatusEnum } from '@shared/hooks';
import { act, fireEvent, render } from '../../../config/testUtils';
import SideSummary from './SideSummary';

describe('SideSummary', () => {
  const Component = () => {
    return <h1>Component</h1>;
  };

  const mockSteps = [
    {
      name: 'ComponentA',
      status: StepStatusEnum.FINISHED,
      component: Component,
      summaryTitle: 'ComponentA',
      title: {
        text: 'ComponentA',
        boldWords: [],
      },
    },
    {
      name: 'ComponentB',
      status: StepStatusEnum.FINISHED,
      component: Component,
      summaryTitle: 'ComponentB',
      title: {
        text: 'ComponentB',
        boldWords: [],
      },
    },
  ];

  it('should be able to edit any step', async () => {
    const { getByTestId, findByTestId } = render(
      <FlowProvider
        allSteps={mockSteps}
        initialSteps={mockSteps}
        showFinishedSteps={false}
      >
        <SideSummary />
      </FlowProvider>,
    );
    const editButtonComponentB = getByTestId(
      'sideSummary-editStep-link-button-ComponentB',
    );
    fireEvent.click(editButtonComponentB);
    const editButtonComponentA = await findByTestId(
      'sideSummary-editStep-link-button-ComponentA',
    );
    expect(editButtonComponentB).not.toBeInTheDocument();
    expect(editButtonComponentA).toBeInTheDocument();
  });

  it('should be able to view the menu in the mobile version', async () => {
    global.innerWidth = 743;
    global.innerHeight = 1038;
    global.dispatchEvent(new Event('resize'));
    const { getByTestId } = render(
      <FlowProvider
        allSteps={mockSteps}
        initialSteps={mockSteps}
        showFinishedSteps={false}
      >
        <SideSummary />
      </FlowProvider>,
    );
    const drawer = getByTestId('sideSummary-mobile-drawer');
    const aside = getByTestId('sideSummary-container-aside');
    await act(async () => {
      await fireEvent.touchStart(drawer, {
        touches: [{ clientY: 972.3 }],
      });
      await fireEvent.touchEnd(drawer, {
        changedTouches: [{ clientY: 764.76 }],
      });
    });
    expect(aside).toHaveClass('side-summary__wrapper--open');
    await act(async () => {
      await fireEvent.touchStart(drawer, {
        touches: [{ clientY: 764.76 }],
      });
      await fireEvent.touchEnd(drawer, {
        changedTouches: [{ clientY: 972.3 }],
      });
    });
    expect(aside).not.toHaveClass('side-summary__wrapper--open');
  });
});

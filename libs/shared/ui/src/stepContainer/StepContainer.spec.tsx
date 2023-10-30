import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { StepStatusEnum } from '@shared/hooks';
import { StepContainer } from './StepContainer';

const stepPropsMock = {
  name: 'ComponentA',
  status: 'editable',
  index: 0,
  title: {
    text: 'Olá. Para iniciar uma nova solicitação de garantia, comece preenchendo os %STRONG%',
    boldWords: ['dados do contrato.'],
  },
};

describe('StepContainer', () => {
  it('should render the corresponding component', async () => {
    const stepIndex = 1;

    const { getByTestId, getByText } = render(
      <StepContainer {...stepPropsMock}>
        <div data-testid={`stepContainer-wrapper-${stepIndex}`}>
          <h1>Component</h1>
        </div>
      </StepContainer>,
    );
    const component = getByTestId(`stepContainer-wrapper-${stepIndex}`);
    const text = getByText(
      'Olá. Para iniciar uma nova solicitação de garantia, comece preenchendo os',
    );
    const boldText = getByText('dados do contrato.');
    const h1 = getByText('Component');

    expect(component).toBeInTheDocument();
    expect(text).toBeInTheDocument();
    expect(boldText).toBeInTheDocument();
    expect(h1).toBeInTheDocument();
  });

  it('should not render in case no component is found', async () => {
    const step = {
      name: 'ComponentZ',
      status: StepStatusEnum.EDITABLE,
      title: {
        text: 'Lorem',
        boldWords: [],
      },
    };
    const stepIndex = 1;

    const { queryByText } = render(
      <StepContainer {...step} index={stepIndex} />,
    );
    const text = await queryByText(
      'Olá. Para iniciar uma nova solicitação de garantia, comece preenchendo os',
    );
    const boldText = await queryByText('dados do contrato.');
    const h1 = await queryByText('Component');

    expect(text).not.toBeInTheDocument();
    expect(boldText).not.toBeInTheDocument();
    expect(h1).not.toBeInTheDocument();
  });

  it('should render the corresponding component', async () => {
    const updatedStepPropsMock = {
      ...stepPropsMock,
      status: StepStatusEnum.FINISHED,
    };

    const { getByTestId, getByText } = render(
      <StepContainer {...updatedStepPropsMock}>
        <div data-testid="stepContainer-wrapper-0">
          <h1>Component</h1>
        </div>
      </StepContainer>,
    );
    const component = getByTestId('stepContainer-wrapper-0');
    const identificationStep = getByTestId(
      'stepContainer-identification-check',
    );
    const text = getByText(
      'Olá. Para iniciar uma nova solicitação de garantia, comece preenchendo os',
    );
    const boldText = getByText('dados do contrato.');

    expect(component).toBeInTheDocument();
    expect(identificationStep).toBeInTheDocument();
    expect(text).toBeInTheDocument();
    expect(boldText).toBeInTheDocument();
  });
});

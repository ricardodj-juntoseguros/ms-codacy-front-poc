import '@testing-library/jest-dom';
import * as reactRedux from 'react-redux'
import { flowActions } from 'modules/vendors-proposal/src/application/features/flow/FlowSlice';
import { StepStatusEnum } from '../../../application/types/model';
import { act, fireEvent, render } from '../../../config/testUtils';
import { constantsMock, storeMock,  } from '../../../__mocks__';
import StepContainer from './StepContainer';

jest.mock('../../../constants', () => (constantsMock));

describe('StepContainer', () => {
  const mockDispatch = jest.fn();
  const useSelectorMock = jest.spyOn(reactRedux, 'useSelector')
  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');

  beforeEach(() => {
    useSelectorMock.mockClear()
    useDispatchMock.mockClear()
  })

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the corresponding component', () => {
    useSelectorMock.mockImplementation(select => select({ ...storeMock }));
    useDispatchMock.mockImplementation(() => mockDispatch);
    const step = storeMock.flow.steps[0];
    const stepIndex = 1;

    const { getByTestId, getByText } = render(<StepContainer {...step} index={stepIndex}/>);
    const component = getByTestId(`stepContainer-wrapper-${stepIndex}`);
    const text = getByText('Olá. Para iniciar uma nova solicitação de garantia, comece preenchendo os');
    const boldText = getByText('dados do contrato.');
    const h1 = getByText('Component');

    expect(component).toBeInTheDocument();
    expect(text).toBeInTheDocument();
    expect(boldText).toBeInTheDocument();
    expect(h1).toBeInTheDocument();
  });

  it('should not render in case no component is found', async () => {
    useSelectorMock.mockImplementation(select => select({ ...storeMock }));
    useDispatchMock.mockImplementation(() => mockDispatch);
    const step = {
      name: 'ComponentZ',
      status: StepStatusEnum.EDITABLE,
      title: {
        text: 'Lorem',
        boldWords: [],
      },
    };
    const stepIndex = 1;

    const { queryByText } = render(<StepContainer {...step} index={stepIndex}/>);
    const text = await queryByText('Olá. Para iniciar uma nova solicitação de garantia, comece preenchendo os');
    const boldText = await queryByText('dados do contrato.');
    const h1 = await queryByText('Component');

    expect(text).not.toBeInTheDocument();
    expect(boldText).not.toBeInTheDocument();
    expect(h1).not.toBeInTheDocument();
  });

  it('should call the handle Next Step function when called by the component changing the step status', async () => {
    useSelectorMock.mockImplementation(select => select({ ...storeMock }));
    useDispatchMock.mockImplementation(() => mockDispatch);
    const step = storeMock.flow.steps[0];
    const stepIndex = 1;

    const { getByText } = render(<StepContainer {...step} index={stepIndex}/>);
    const button = getByText('next');
    await act(async () => {
      await fireEvent.click(button);
    });

    expect(mockDispatch).toHaveBeenCalledWith(flowActions.setInfoText({ name: step.name,  text: 'Component' }));
    expect(mockDispatch).toHaveBeenCalledWith(flowActions.advanceStep());
  });

  it('should call handle EditableStep function when click on edit button', async () => {
    useSelectorMock.mockImplementation(select => select({ ...storeMock }));
    useDispatchMock.mockImplementation(() => mockDispatch);
    const step = storeMock.flow.steps[0];
    const stepIndex = 1;
    step.status = StepStatusEnum.FINISHED;

    const { getByTestId, getByText } = render(<StepContainer {...step} index={stepIndex}/>);
    const component = getByTestId('stepContainer-finishContent-1')

    expect(component).toBeInTheDocument();

    const identificationStep = getByTestId('stepContainer-identification-check');
    const infoText = getByText('Component');

    expect(identificationStep).toBeInTheDocument();
    expect(infoText).toBeInTheDocument();

    const button = getByTestId('stepContainer-button-edit');
    await act(async () => {
      await fireEvent.click(button);
    });

    expect(mockDispatch).toHaveBeenCalledWith(flowActions.setEditableStep(step.name));
  });
});

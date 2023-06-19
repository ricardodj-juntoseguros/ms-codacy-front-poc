import '@testing-library/jest-dom';
import * as reactRedux from 'react-redux';
import { render } from '../../../config/testUtils';
import { storeMock } from '../../../__mocks__/storeMock';
import FlowContainer from './FlowContainer';

describe('FlowContainer', () => {
  const mockDispatch = jest.fn();
  const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');

  beforeEach(() => {
    useSelectorMock.mockClear();
    useDispatchMock.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully', async () => {
    useSelectorMock.mockImplementation(select => select({ ...storeMock }));
    useDispatchMock.mockImplementation(() => mockDispatch);

    const { baseElement, queryByTestId } = render(<FlowContainer />);

    const firstStep = await queryByTestId('stepContainer-wrapper-0');
    const secondStep = await queryByTestId('stepContainer-wrapper-1');

    expect(baseElement).toBeInTheDocument();
    expect(firstStep).toBeInTheDocument();
    expect(secondStep).not.toBeInTheDocument();
  });
});

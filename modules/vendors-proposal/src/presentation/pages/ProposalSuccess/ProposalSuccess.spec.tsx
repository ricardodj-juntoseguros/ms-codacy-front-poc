import '@testing-library/jest-dom';
import * as reactRedux from 'react-redux';
import { storeMock } from 'modules/vendors-proposal/src/__mocks__';
import { act, fireEvent, render } from '../../../config/testUtils';
import ProposalSuccess from './ProposalSuccess';

const mockHistoryPush = jest.fn();
jest.mock('react-router', () => {
  const rest = jest.requireActual('react-router');

  return {
    ...rest,
    useHistory: () => ({
      push: mockHistoryPush,
    }),
  };
});

describe('ProposalSuccess', () => {
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

  it('should go to home if you can t a proposal id', () => {
    useSelectorMock.mockImplementation(select =>
      select({
        ...storeMock,
        proposal: {
          ...storeMock.proposal,
          identification: null,
        },
      }),
    );
    useDispatchMock.mockImplementation(() => mockDispatch);
    render(<ProposalSuccess />);

    expect(mockHistoryPush).toHaveBeenCalled();
  });

  it('should render correctly', () => {
    useSelectorMock.mockImplementation(select =>
      select({
        ...storeMock,
        proposal: {
          ...storeMock.proposal,
          identification: {
            proposalId: 12345,
            policyId: 12345,
          },
        },
      }),
    );
    useDispatchMock.mockImplementation(() => mockDispatch);
    const { baseElement } = render(<ProposalSuccess />);

    expect(baseElement).toBeInTheDocument();
  });

  it('should go to home when user click on button', async () => {
    useSelectorMock.mockImplementation(select =>
      select({
        ...storeMock,
        proposal: {
          ...storeMock.proposal,
          identification: {
            proposalId: 12345,
            policyId: 12345,
          },
        },
      }),
    );
    useDispatchMock.mockImplementation(() => mockDispatch);
    const { getByTestId } = render(<ProposalSuccess />);

    const button = getByTestId('proposalSuccess-button-go-home');
    await act(async () => {
      await fireEvent.click(button);
    });

    expect(mockHistoryPush).toHaveBeenCalled();
  });
});

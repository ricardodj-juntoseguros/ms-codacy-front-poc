import { act, fireEvent, render } from '../../../config/testUtils';
import QuoteFinishContainer from './QuoteFinishContainer';

const mockHistoryPush = jest.fn();
jest.mock('react-router', () => ({
  ...(jest.requireActual('react-router') as any),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

beforeAll(() => {
  process.env.NX_GLOBAL_BROKER_PROCESSES_URL = '/processes';
  Object.defineProperty(window, 'location', {
    writable: true,
    value: { assign: jest.fn() },
  });
});

describe('QuoteContainer component', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<QuoteFinishContainer />);
    expect(baseElement).toBeTruthy();
  });

  it('should be able to redirect user for new quote', async () => {
    const { getByTestId } = render(<QuoteFinishContainer />);
    const button = getByTestId('quoteFinishContainer-new-quote-button');
    await act(async () => {
      await fireEvent.click(button);
    });
    expect(mockHistoryPush).toHaveBeenCalledWith('/');
  });

  it('should be able to redirect user for new quote', async () => {
    const { getByTestId } = render(<QuoteFinishContainer />);
    const button = getByTestId('quoteFinishContainer-go-to-process-button');
    await act(async () => {
      await fireEvent.click(button);
    });
    expect(window.location.assign).toHaveBeenCalledWith('/processes');
  });
});

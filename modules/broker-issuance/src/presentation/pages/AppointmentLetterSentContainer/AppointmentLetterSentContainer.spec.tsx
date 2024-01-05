import { act, fireEvent, render } from '../../../config/testUtils';
import AppointmentLetterSentContainer from './AppointmentLetterSentContainer';

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

describe('AppointmentLetterSentContainer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AppointmentLetterSentContainer />);
    expect(baseElement).toBeTruthy();
  });

  it('should be able to redirect user for new quote', async () => {
    const { getByTestId } = render(<AppointmentLetterSentContainer />);
    const button = getByTestId(
      'appointmentLetterSentContainer-new-quote-button',
    );
    await act(async () => {
      await fireEvent.click(button);
    });
    expect(mockHistoryPush).toHaveBeenCalledWith('/');
  });

  it('should be able to redirect user for new quote', async () => {
    const { getByTestId } = render(<AppointmentLetterSentContainer />);
    const button = getByTestId(
      'appointmentLetterSentContainer-go-to-process-button',
    );
    await act(async () => {
      await fireEvent.click(button);
    });
    expect(window.location.assign).toHaveBeenCalledWith('/processes');
  });
});

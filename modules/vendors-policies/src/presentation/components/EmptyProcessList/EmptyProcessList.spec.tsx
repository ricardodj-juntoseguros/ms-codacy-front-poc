import '@testing-library/jest-dom';
import { fireEvent, render } from '../../../config/testUtils';
import EmptyProcessList from './EmptyProcessList';

describe('EmptyProcessList', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { assign: jest.fn() },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should redirect to proposal page on button click', () => {
    const { getByText, getByTestId } = render(<EmptyProcessList />);
    expect(getByText('Você ainda não possui processos')).toBeInTheDocument();
    expect(
      getByText(
        'Assim que houverem garantias solicitadas, elas serão listadas aqui para acompanhamento.',
      ),
    ).toBeInTheDocument();
    const button = getByTestId('emptyProcessList-button-proposal');
    fireEvent.click(button);
    expect(window.location.assign).toHaveBeenCalledWith('/proposal');
  });
});

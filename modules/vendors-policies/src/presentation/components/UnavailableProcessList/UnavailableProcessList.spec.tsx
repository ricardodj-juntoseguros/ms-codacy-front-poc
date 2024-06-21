import '@testing-library/jest-dom';
import { render } from '../../../config/testUtils';
import UnavailableProcessList from './UnavailableProcessList';

describe('UnavailableProcessList', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should render correctly if hasError prop is false', () => {
    const { getByText } = render(<UnavailableProcessList />);
    expect(getByText('Lista indisponível')).toBeInTheDocument();
    expect(
      getByText(
        'Esta lista não está disponível no momento. Em breve você conseguirá acessá-la.',
      ),
    ).toBeInTheDocument();
  });
});

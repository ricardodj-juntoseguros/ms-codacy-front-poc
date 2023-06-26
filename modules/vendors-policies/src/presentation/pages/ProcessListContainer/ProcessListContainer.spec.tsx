import '@testing-library/jest-dom';
import { VendorsAuthService } from '@services';
import { fireEvent, render } from '../../../config/testUtils';
import ProcessListContainer from './ProcessListContainer';

describe('ProcessListContainer', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { assign: jest.fn() },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render greeting successfully for insured type user', async () => {
    jest.spyOn(VendorsAuthService, 'getUsername').mockImplementation(() => {
      return 'test insured';
    });
    jest.spyOn(VendorsAuthService, 'getUserType').mockImplementation(() => {
      return 'insured';
    });
    const { getByText } = render(<ProcessListContainer />);

    expect(getByText('Olá, test insured')).toBeInTheDocument();
    expect(
      getByText('acompanhe aqui seus contratos e garantias'),
    ).toBeInTheDocument();
  });

  it('should render greeting successfully for broker type user', async () => {
    jest.spyOn(VendorsAuthService, 'getUsername').mockImplementation(() => {
      return 'test broker';
    });
    jest.spyOn(VendorsAuthService, 'getUserType').mockImplementation(() => {
      return 'broker';
    });
    const { getByText } = render(<ProcessListContainer />);

    expect(getByText('Olá, test broker')).toBeInTheDocument();
    expect(
      getByText('acompanhe aqui seus contratos e garantias'),
    ).toBeInTheDocument();
  });

  it('should render greeting successfully for policyholder type user', async () => {
    jest.spyOn(VendorsAuthService, 'getUsername').mockImplementation(() => {
      return 'test policyholder';
    });
    jest.spyOn(VendorsAuthService, 'getUserType').mockImplementation(() => {
      return 'policyholder';
    });
    const { getByText } = render(<ProcessListContainer />);

    expect(getByText('Olá, test policyholder')).toBeInTheDocument();
    expect(
      getByText('acompanhe aqui suas oportunidades de negócio'),
    ).toBeInTheDocument();
  });

  it('Should not render new proposal button for user type broker', () => {
    jest.spyOn(VendorsAuthService, 'getUserType').mockImplementation(() => {
      return 'broker';
    });
    const { queryByTestId } = render(<ProcessListContainer />);
    expect(
      queryByTestId('processListContainer-button-new-proposal'),
    ).not.toBeInTheDocument();
  });

  it('Should not render new proposal button for user type policyholder', () => {
    jest.spyOn(VendorsAuthService, 'getUserType').mockImplementation(() => {
      return 'policyholder';
    });
    const { queryByTestId } = render(<ProcessListContainer />);
    expect(
      queryByTestId('processListContainer-button-new-proposal'),
    ).not.toBeInTheDocument();
  });

  it('Should render new proposal button for user type insured and go to proposal page when clicked', () => {
    jest.spyOn(VendorsAuthService, 'getUserType').mockImplementation(() => {
      return 'insured';
    });
    const { getByTestId } = render(<ProcessListContainer />);
    const btn = getByTestId('processListContainer-button-new-proposal');
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(window.location.assign).toHaveBeenCalledWith('/proposal');
  });
});

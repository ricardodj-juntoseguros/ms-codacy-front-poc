import '@testing-library/jest-dom';
import { UserTypeEnum, VendorsAuthService } from '@services';
import { fireEvent, render } from '../../../config/testUtils';
import ProcessListingApi from '../../../application/features/processListing/ProcessListingApi';
import { proposalListMock } from '../../../__mocks__';
import ProcessListContainer from './ProcessListContainer';

describe('ProcessListContainer', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { assign: jest.fn() },
    });
    jest
      .spyOn(ProcessListingApi, 'getProcesses')
      .mockImplementation(async () => {
        return proposalListMock;
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
      return UserTypeEnum.INSURED;
    });
    const { getByText, findByText } = render(<ProcessListContainer />);
    await findByText('3 processos listados.');
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
      return UserTypeEnum.BROKER;
    });
    const { getByText, findByText } = render(<ProcessListContainer />);
    await findByText('3 processos listados.');
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
      return UserTypeEnum.POLICYHOLDER;
    });
    const { getByText, findByText } = render(<ProcessListContainer />);
    await findByText('3 processos listados.');
    expect(getByText('Olá, test policyholder')).toBeInTheDocument();
    expect(
      getByText('acompanhe aqui suas oportunidades de negócio'),
    ).toBeInTheDocument();
  });

  it('Should not render new proposal button for user type broker', async () => {
    jest.spyOn(VendorsAuthService, 'getUserType').mockImplementation(() => {
      return UserTypeEnum.BROKER;
    });
    const { queryByTestId } = render(<ProcessListContainer />);
    expect(
      queryByTestId('processListContainer-button-new-proposal'),
    ).not.toBeInTheDocument();
  });

  it('Should not render new proposal button for user type policyholder', async () => {
    jest.spyOn(VendorsAuthService, 'getUserType').mockImplementation(() => {
      return UserTypeEnum.POLICYHOLDER;
    });
    const { queryByTestId } = render(<ProcessListContainer />);
    expect(
      queryByTestId('processListContainer-button-new-proposal'),
    ).not.toBeInTheDocument();
  });

  it('Should render new proposal button for user type insured and go to proposal page when clicked', async () => {
    jest.spyOn(VendorsAuthService, 'getUserType').mockImplementation(() => {
      return UserTypeEnum.INSURED;
    });
    const { getByTestId, findByText } = render(<ProcessListContainer />);
    await findByText('3 processos listados.');
    const btn = getByTestId('processListContainer-button-new-proposal');
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(window.location.assign).toHaveBeenCalledWith('/proposal');
  });
});

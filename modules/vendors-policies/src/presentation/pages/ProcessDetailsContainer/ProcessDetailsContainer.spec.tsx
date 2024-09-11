import '@testing-library/jest-dom';
import { UserTypeEnum, VendorsAuthService } from '@services';
import Router from 'react-router';
import { act } from 'react-dom/test-utils';
import DocumentAPI from '../../../application/features/document/DocumentAPI';
import { fireEvent, render } from '../../../config/testUtils';
import ProcessDetailsContainer from './ProcessDetailsContainer';
import ProcessDetailsAPI from '../../../application/features/processDetails/ProcessDetailsAPI';
import { mockProcessDetails } from '../../../__mocks__/mockProcessDetails';
import { useNavigate } from 'react-router-dom';

const mockHistoryPush = jest.fn();
const mockHistoryGoBack = jest.fn();
jest.mock('react-router', () => {
  const rest = jest.requireActual('react-router');

  return {
    ...rest,
    useNavigate: () => mockHistoryPush,
  };
});

describe('ProcessDetailsContainer', () => {
  const windowOpen = jest.fn();
  window.open = windowOpen;
  process.env.NX_GLOBAL_MS_DOCUMENTS = '';

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  beforeEach(() => {
    jest
      .spyOn(ProcessDetailsAPI, 'getProcessDetails')
      .mockImplementation(async () => Promise.resolve(mockProcessDetails));
    jest
      .spyOn(DocumentAPI, 'getProposalDocuments')
      .mockImplementation(async () => [
        {
          filename: 'arquivo teste',
          size: 0.19,
        },
      ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect to the list if the parameter sent is incorrect', async () => {
    jest.spyOn(VendorsAuthService, 'getUserType').mockImplementation(() => {
      return UserTypeEnum.INSURED;
    });
    jest.spyOn(Router, 'useParams').mockReturnValue({ proposalId: 'aa' });

    render(<ProcessDetailsContainer />);

    expect(mockHistoryPush).toHaveBeenCalled();
  });

  it('should not render issuance claim button on policyholder', async () => {
    jest.spyOn(VendorsAuthService, 'getUserType').mockImplementation(() => {
      return UserTypeEnum.POLICYHOLDER;
    });
    const { queryByTestId } = render(<ProcessDetailsContainer />);

    const button = await queryByTestId('processDetails-button-issuance-claim');

    expect(button).not.toBeInTheDocument();
  });

  it('should change title and text if status changes', async () => {
    jest.spyOn(VendorsAuthService, 'getUserType').mockImplementation(() => {
      return UserTypeEnum.POLICYHOLDER;
    });
    jest
      .spyOn(ProcessDetailsAPI, 'getProcessDetails')
      .mockImplementation(() => {
        return Promise.resolve({
          ...mockProcessDetails,
          status: 3,
        });
      });
    const { findByText } = render(<ProcessDetailsContainer />);

    const title = await findByText('Solicitação 3885179');

    expect(title).toBeInTheDocument();
  });

  it('should not render screen items if it does not have the details', async () => {
    jest.spyOn(VendorsAuthService, 'getUserType').mockImplementation(() => {
      return UserTypeEnum.POLICYHOLDER;
    });
    jest
      .spyOn(ProcessDetailsAPI, 'getProcessDetails')
      .mockImplementation(() => {
        return Promise.resolve({
          ...mockProcessDetails,
          status: 10,
        });
      });
    const { queryByTestId } = render(<ProcessDetailsContainer />);

    const status = await queryByTestId('processDetailsHeader-paragraph-status');
    const title = await queryByTestId('Solicitação 3885179');
    const issuanceClaimButton = await queryByTestId(
      'processDetails-button-issuance-claim',
    );

    expect(status).not.toBeInTheDocument();
    expect(title).not.toBeInTheDocument();
    expect(issuanceClaimButton).not.toBeInTheDocument();
  });

  it('should go back to list if an error occurs in the call of details', async () => {
    jest.spyOn(VendorsAuthService, 'getUserType').mockImplementation(() => {
      return UserTypeEnum.POLICYHOLDER;
    });
    jest
      .spyOn(ProcessDetailsAPI, 'getProcessDetails')
      .mockImplementation(async () => Promise.reject());
    render(<ProcessDetailsContainer />);

    expect(mockHistoryPush).toHaveBeenCalled();
  });

  it('should go back to save screen if click back to my dashboard', async () => {
    jest.spyOn(VendorsAuthService, 'getUserType').mockImplementation(() => {
      return UserTypeEnum.POLICYHOLDER;
    });

    const { findByText } = render(<ProcessDetailsContainer />);
    const linkButton = await findByText('Voltar para meu painel');

    act(async () => {
      await fireEvent.click(linkButton);
    });

    expect(mockHistoryGoBack).toHaveBeenCalled();
  });
});

import '@testing-library/jest-dom';
import { VendorsAuthService } from '@services';
import Router from 'react-router';
import { act } from 'react-dom/test-utils';
import DocumentAPI from '../../../application/features/document/DocumentAPI';
import { fireEvent, render } from '../../../config/testUtils';
import ProcessDetails from './ProcessDetails';
import ProcessDetailsAPI from '../../../application/features/processDetails/ProcessDetailsAPI';
import { mockProcessDetails } from '../../../__mocks__/mockProcessDetails';

const mockHistoryPush = jest.fn();
const mockHistoryGoBack = jest.fn();
jest.mock('react-router', () => {
  const rest = jest.requireActual('react-router');

  return {
    ...rest,
    useHistory: () => ({
      push: mockHistoryPush,
      goBack: mockHistoryGoBack,
    }),
  };
});

describe('ProcessDetails', () => {
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
      return 'insured';
    });
    jest.spyOn(Router, 'useParams').mockReturnValue({ proposalId: 'aa' });

    render(<ProcessDetails />);

    expect(mockHistoryPush).toHaveBeenCalled();
  });

  it('should open a new tab if the user clicks on the buttons', async () => {
    jest.spyOn(VendorsAuthService, 'getUserType').mockImplementation(() => {
      return 'insured';
    });
    const { findByTestId } = render(<ProcessDetails />);

    const buttonIssuanceClaim = await findByTestId(
      'processDetails-button-issuance-claim',
    );
    const buttonCertificate = await findByTestId(
      'processDetails-button-certificate',
    );

    await act(async () => {
      await fireEvent.click(buttonIssuanceClaim);
    });

    await act(async () => {
      await fireEvent.click(buttonCertificate);
    });

    expect(windowOpen).toHaveBeenCalledWith(
      'certificateRegularity/download?format=pdf',
      '_blank',
    );
    expect(windowOpen).toHaveBeenCalledWith(
      'https://www.juntoseguros.com/canal-de-sinistro/',
      '_blank',
    );
  });

  it('should not render issuance claim button on policyholder', async () => {
    jest.spyOn(VendorsAuthService, 'getUserType').mockImplementation(() => {
      return 'policyholder';
    });
    const { queryByTestId } = render(<ProcessDetails />);

    const button = await queryByTestId('processDetails-button-issuance-claim');

    expect(button).not.toBeInTheDocument();
  });

  it('should change title and text if status changes', async () => {
    jest.spyOn(VendorsAuthService, 'getUserType').mockImplementation(() => {
      return 'policyholder';
    });
    jest
      .spyOn(ProcessDetailsAPI, 'getProcessDetails')
      .mockImplementation(() => {
        return Promise.resolve({
          ...mockProcessDetails,
          status: 3,
        });
      });
    const { findByText } = render(<ProcessDetails />);

    const title = await findByText('Solicitação 3885179');

    expect(title).toBeInTheDocument();
  });

  it('should not render screen items if it does not have the details', async () => {
    jest.spyOn(VendorsAuthService, 'getUserType').mockImplementation(() => {
      return 'policyholder';
    });
    jest
      .spyOn(ProcessDetailsAPI, 'getProcessDetails')
      .mockImplementation(() => {
        return Promise.resolve({
          ...mockProcessDetails,
          status: 10,
        });
      });
    const { queryByTestId } = render(<ProcessDetails />);

    const status = await queryByTestId('processDetails-paragraph-status');
    const title = await queryByTestId('Solicitação 3885179');
    const issuanceClaimButton = await queryByTestId(
      'processDetails-button-issuance-claim',
    );
    const downloadPolicyButton = await queryByTestId(
      'processDetails-button-download-policy',
    );

    expect(status).not.toBeInTheDocument();
    expect(title).not.toBeInTheDocument();
    expect(issuanceClaimButton).not.toBeInTheDocument();
    expect(downloadPolicyButton).not.toBeInTheDocument();
  });

  it('should  call the policy download endpoint when the button is clicked', async () => {
    jest.spyOn(VendorsAuthService, 'getUserType').mockImplementation(() => {
      return 'policyholder';
    });
    const getPolicyDocumentMock = jest
      .spyOn(DocumentAPI, 'getPolicyDocument')
      .mockImplementation(async () => ({ linkDocumento: 'test' }));
    const { findByTestId } = render(<ProcessDetails />);

    const downloadPolicyButton = await findByTestId(
      'processDetails-button-download-policy',
    );

    act(async () => {
      await fireEvent.click(downloadPolicyButton);
    });

    expect(getPolicyDocumentMock).toHaveBeenCalledWith(3885179);
  });

  it('should go back to list if an error occurs in the call of details', async () => {
    jest.spyOn(VendorsAuthService, 'getUserType').mockImplementation(() => {
      return 'policyholder';
    });
    jest
      .spyOn(ProcessDetailsAPI, 'getProcessDetails')
      .mockImplementation(async () => Promise.reject());
    render(<ProcessDetails />);

    expect(mockHistoryPush).toHaveBeenCalled();
  });

  it('should go back to save screen if click back to my dashboard', async () => {
    jest.spyOn(VendorsAuthService, 'getUserType').mockImplementation(() => {
      return 'policyholder';
    });

    const { findByText } = render(<ProcessDetails />);
    const linkButton = await findByText('Voltar para meu painel');

    act(async () => {
      await fireEvent.click(linkButton);
    });

    expect(mockHistoryGoBack).toHaveBeenCalled();
  });
});

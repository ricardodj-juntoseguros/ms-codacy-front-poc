import '@testing-library/jest-dom';
import * as reactRedux from 'react-redux';
import { downloadFile } from '@shared/utils';
import { storeMock } from 'modules/vendors-proposal/src/__mocks__';
import { act, fireEvent, render } from '../../../config/testUtils';
import DownloadProposalDocumentAPI from '../../../application/features/downloadProposalDocument/DownloadProposalDocumentAPI';
import ProposalSuccessContainer from './ProposalSuccessContainer';

const mockHistoryPush = jest.fn();
jest.mock('react-router', () => {
  const rest = jest.requireActual('react-router');

  return {
    ...rest,
    useNavigate: () => mockHistoryPush,
  };
});

jest.mock('@shared/utils', () => {
  const original = jest.requireActual('@shared/utils');
  return {
    ...original,
    downloadFile: jest.fn(),
  };
});

describe('ProposalSuccess', () => {
  const mockDispatch = jest.fn();
  const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
  const file = {
    fieldname: 'file',
    originalname: '3880885.pdf',
    encoding: '7bit',
    mimetype: 'application/pdf',
    buffer: Buffer.alloc(253397, 1),
    size: 415423,
    stream: undefined,
    destination: undefined,
    filename: undefined,
    path: undefined,
  };

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { assign: jest.fn() },
    });
  });

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
    render(<ProposalSuccessContainer />);

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
    const { baseElement } = render(<ProposalSuccessContainer />);

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
    const { getByTestId } = render(<ProposalSuccessContainer />);

    const button = getByTestId('proposalSuccess-button-go-home');
    await act(async () => {
      await fireEvent.click(button);
    });

    expect(window.location.assign).toHaveBeenCalledWith(
      `${process.env.NX_GLOBAL_VENDORS_PLATFORM_URL}/policies`,
    );
  });

  it('should download the proposal document', async () => {
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
    const getProposalDocumentMock = jest
      .spyOn(DownloadProposalDocumentAPI, 'getProposalDocument')
      .mockImplementation(() => {
        return Promise.resolve(file);
      });

    const { getByTestId } = render(<ProposalSuccessContainer />);

    const button = getByTestId('proposalSuccess-button-download-proposal');
    await act(async () => {
      await fireEvent.click(button);
    });

    expect(getProposalDocumentMock).toHaveBeenCalledWith(12345);
    expect(downloadFile).toHaveBeenCalledWith(new Blob(), 'proposta_12345.pdf');
  });
});

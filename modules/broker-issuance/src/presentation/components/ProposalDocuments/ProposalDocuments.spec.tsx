/* eslint-disable prefer-promise-reject-errors */
import '@testing-library/jest-dom';
import { BrokerPlatformAuthService } from '@services';
import { makeToast } from 'junto-design-system';
import { quoteSliceActions } from '../../../application/features/quote/QuoteSlice';
import { fireEvent, render, waitFor } from '../../../config/testUtils';
import ProposalDocumentsApi from '../../../application/features/proposalDocuments/ProposalDocumentsApi';
import ProposalApi from '../../../application/features/proposal/ProposalApi';
import { putProposal } from '../../../application/features/proposal/ProposalSlice';
import CanAuthorizeApi from '../../../application/features/canAuthorize/CanAuthorizeApi';
import { proposalMock, modalityBidderMock } from '../../../__mocks__';
import ProposalDocuments from './ProposalDocuments';
import { store } from '../../../config/store';

jest.mock('junto-design-system', () => {
  const original = jest.requireActual('junto-design-system');
  return {
    ...original,
    makeToast: jest.fn(),
  };
});

describe('ProposalDocuments', () => {
  const mockResult = [
    {
      size: 12345,
      url: 'url',
      extension: 'pdf',
      filename: 'test',
      metadata: null,
    },
  ];
  const file = new File(['(⌐□_□)'], 'fileTest.pdf', {
    type: 'application/pdf',
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(ProposalApi, 'putProposal').mockImplementation(() =>
      Promise.resolve({
        ProposalId: 12345,
        PolicyId: 11111,
        QuotationId: 12223,
        NewQuoterId: 123333,
        createdAt: new Date().toISOString(),
      }),
    );
    jest.spyOn(CanAuthorizeApi, 'getCanAuthorize').mockImplementation(() =>
      Promise.resolve({
        isAutomaticPolicy: false,
        issueMessage: '',
        hasOnlyFinancialPending: false,
      }),
    );
    await store.dispatch(
      putProposal({ proposalId: 12345, proposalData: proposalMock }),
    );
    store.dispatch(
      quoteSliceActions.setModality({
        ...modalityBidderMock,
      }),
    );
    jest
      .spyOn(BrokerPlatformAuthService, 'getUserType')
      .mockImplementation(() => 1);
  });

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

  it('should be able to render the necessary documents for submission', () => {
    jest
      .spyOn(ProposalDocumentsApi, 'getProposalDocuments')
      .mockImplementation(() => Promise.resolve(mockResult));
    const { getByText } = render(<ProposalDocuments />);
    expect(
      getByText(
        '- Edital de Licitação com todos os anexos ou a Carta Convite Minuta do Contrato.',
      ),
    ).toBeInTheDocument();
    expect(
      getByText(
        '- Em caso de consórcio, envie a Minuta do Termo de Constituição de Consórcio ou da SPE.',
      ),
    ).toBeInTheDocument();
  });

  it('should be able to upload the necessary documents', () => {
    const getMock = jest
      .spyOn(ProposalDocumentsApi, 'getProposalDocuments')
      .mockImplementation(() => Promise.resolve(mockResult));
    const postMock = jest
      .spyOn(ProposalDocumentsApi, 'postProposalDocument')
      .mockImplementation(() => Promise.resolve(mockResult[0]));
    const { getByTestId, getByText } = render(<ProposalDocuments />);
    fireEvent.change(getByTestId('input-files'), { target: { files: [file] } });
    expect(getByText('fileTest.pdf')).toBeInTheDocument();
    expect(postMock).toHaveBeenCalled();
    expect(getMock).toHaveBeenCalledTimes(1);
  });

  it('should be able to delete a file', () => {
    const getMock = jest
      .spyOn(ProposalDocumentsApi, 'getProposalDocuments')
      .mockImplementation(() => Promise.resolve(mockResult));
    const deleteMock = jest
      .spyOn(ProposalDocumentsApi, 'deleteProposalDocument')
      .mockImplementation(() => Promise.resolve());
    const { getByTestId } = render(<ProposalDocuments />);
    fireEvent.click(getByTestId('remove-file'));
    expect(getMock).toHaveBeenCalledTimes(1);
    expect(deleteMock).toHaveBeenCalledWith(11111, 'test');
  });

  it('should be able to report an error if a problem occurs removing the file', async () => {
    const getMock = jest
      .spyOn(ProposalDocumentsApi, 'getProposalDocuments')
      .mockImplementation(() => Promise.resolve(mockResult));
    const deleteMock = jest
      .spyOn(ProposalDocumentsApi, 'deleteProposalDocument')
      .mockImplementation(() =>
        Promise.reject({ data: { data: { message: 'error' } } }),
      );
    const { getByTestId } = render(<ProposalDocuments />);
    fireEvent.click(getByTestId('remove-file'));
    expect(getMock).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(deleteMock).toHaveBeenCalledWith(11111, 'test');
    });
  });
});

/* eslint-disable prefer-promise-reject-errors */
import '@testing-library/jest-dom';
import ProposalDocumentsApi from '../../../application/features/proposalDocuments/ProposalDocumentsApi';
import { commercialAuthorizationActions } from '../../../application/features/CommercialAuthorization/CommercialAuthorizationSlice';
import { fireEvent, render, waitFor } from '../../../config/testUtils';
import { store } from '../../../config/store';
import { putProposal } from '../../../application/features/proposal/ProposalSlice';
import QuoteApi from '../../../application/features/quote/QuoteApi';
import {
  createQuoteMock,
  proposalMock,
  quoteResultMock,
} from '../../../__mocks__';
import { postQuotation } from '../../../application/features/quote/QuoteSlice';
import ProposalApi from '../../../application/features/proposal/ProposalApi';
import CommercialAuthorizationApi from '../../../application/features/CommercialAuthorization/CommercialAuthorizationApi';
import CommercialAuthorization from './CommercialAuthorization';

describe('CommercialAuthorization', () => {
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
  let postCommercialAuthorizationLetterMock: jest.SpyInstance;
  let deleteProposalDocumentMock: jest.SpyInstance;

  beforeEach(async () => {
    postCommercialAuthorizationLetterMock = jest
      .spyOn(CommercialAuthorizationApi, 'postCommercialAuthorizationLetter')
      .mockImplementation(() => Promise.resolve(mockResult));
    deleteProposalDocumentMock = jest
      .spyOn(ProposalDocumentsApi, 'deleteProposalDocument')
      .mockImplementation(() => Promise.resolve());
    jest
      .spyOn(QuoteApi, 'postQuotation')
      .mockImplementation(async () => quoteResultMock);
    store.dispatch(
      commercialAuthorizationActions.clearCommercialAuthorization(),
    );
    await store.dispatch(postQuotation(createQuoteMock));
    jest.spyOn(ProposalApi, 'putProposal').mockImplementation(() =>
      Promise.resolve({
        ProposalId: 12345,
        PolicyId: 11111,
        QuotationId: 12223,
        NewQuoterId: 123333,
        createdAt: '2021-01-01T00:00:00',
      }),
    );
    await store.dispatch(
      putProposal({ proposalId: 12345, proposalData: proposalMock }),
    );
  });

  it('should be able to add emails for approval', () => {
    const { getByTestId, getByText } = render(<CommercialAuthorization />);
    const emailInput = getByTestId('commercialAuthorization-input-contact');
    const addEmailInput = getByTestId('commercialAuthorization-button-add');
    fireEvent.change(emailInput, { target: { value: 'email@email.com' } });
    fireEvent.click(addEmailInput);
    expect(getByText('email@email.com')).toBeInTheDocument();
  });

  it('should be able to send a letter of authorization', () => {
    const { getByTestId, getByText } = render(<CommercialAuthorization />);
    const hasAuthorizationRadio = getByTestId(
      'commercialAuthorization-hasAuthorization-radio-button',
    );
    fireEvent.click(hasAuthorizationRadio);
    fireEvent.change(getByTestId('input-files'), { target: { files: [file] } });
    expect(getByText('fileTest.pdf')).toBeInTheDocument();
    expect(postCommercialAuthorizationLetterMock).toHaveBeenCalled();
  });

  it('should be able to display an error if the upload fails', async () => {
    postCommercialAuthorizationLetterMock = jest
      .spyOn(CommercialAuthorizationApi, 'postCommercialAuthorizationLetter')
      .mockImplementation(() => Promise.reject({ data: { message: 'error' } }));
    const { getByTestId, getByText } = render(<CommercialAuthorization />);
    const hasAuthorizationRadio = getByTestId(
      'commercialAuthorization-hasAuthorization-radio-button',
    );
    fireEvent.click(hasAuthorizationRadio);
    fireEvent.change(getByTestId('input-files'), { target: { files: [file] } });
    expect(getByText('fileTest.pdf')).toBeInTheDocument();
    await waitFor(
      async () =>
        await expect(postCommercialAuthorizationLetterMock).toHaveBeenCalled(),
    );
    expect(getByText('Erro no envio')).toBeInTheDocument();
  });

  it('should be able to delete a letter of authorization', () => {
    store.dispatch(
      commercialAuthorizationActions.setDocumentsForAuthorization([
        {
          name: 'fileTest.pdf',
          url: '',
          size: 12345,
        },
      ]),
    );
    const { getByTestId } = render(<CommercialAuthorization />);
    const hasAuthorizationRadio = getByTestId(
      'commercialAuthorization-hasAuthorization-radio-button',
    );
    fireEvent.click(hasAuthorizationRadio);
    fireEvent.click(getByTestId('remove-file'));
    expect(deleteProposalDocumentMock).toHaveBeenCalledWith(
      11111,
      'fileTest.pdf',
    );
  });

  it('should be able to display an error if the delete fails', async () => {
    deleteProposalDocumentMock = jest
      .spyOn(ProposalDocumentsApi, 'deleteProposalDocument')
      .mockImplementation(() => Promise.reject({ data: { message: 'error' } }));
    store.dispatch(
      commercialAuthorizationActions.setDocumentsForAuthorization([
        {
          name: 'fileTest.pdf',
          url: '',
          size: 12345,
        },
      ]),
    );
    const { getByTestId } = render(<CommercialAuthorization />);
    const hasAuthorizationRadio = getByTestId(
      'commercialAuthorization-hasAuthorization-radio-button',
    );
    fireEvent.click(hasAuthorizationRadio);
    fireEvent.click(getByTestId('remove-file'));
    await waitFor(
      async () =>
        await expect(deleteProposalDocumentMock).toHaveBeenCalledWith(
          11111,
          'fileTest.pdf',
        ),
    );
    expect(getByTestId('file-process')).toBeInTheDocument();
  });
});

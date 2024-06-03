import '@testing-library/jest-dom';
import { render, fireEvent } from '../../../config/testUtils';
import { store } from '../../../config/store';
import CommercialInternalize from './CommercialInternalize';
import { quoteSliceActions } from '../../../application/features/quote/QuoteSlice';
import { PolicyholderModel } from '../../../application/types/model';
import { proposalDocumentsActions } from '../../../application/features/proposalDocuments/ProposalDocumentsSlice';
import ProposalDocumentsApi from '../../../application/features/proposalDocuments/ProposalDocumentsApi';
import { putProposal } from '../../../application/features/proposal/ProposalSlice';
import ProposalApi from '../../../application/features/proposal/ProposalApi';
import { proposalMock } from '../../../__mocks__';

describe('CommercialInternalize', () => {
  beforeEach(() => {
    store.dispatch(
      quoteSliceActions.setPolicyholder({
        disabledFeatures: { forcedInternalization: false },
      } as PolicyholderModel),
    );
  });

  it('should not render component if selected policyholder have forcedInternalization disabled feature', async () => {
    store.dispatch(
      quoteSliceActions.setPolicyholder({
        disabledFeatures: { forcedInternalization: true },
      } as PolicyholderModel),
    );
    const { queryByTestId } = render(<CommercialInternalize />);
    expect(
      queryByTestId('commercialInternalize-toggle'),
    ).not.toBeInTheDocument();
  });

  it('should only render reason textarea if toggle is checked', async () => {
    const { getByTestId, queryByTestId } = render(<CommercialInternalize />);
    expect(
      queryByTestId('commercialInternalize-reason-textarea'),
    ).not.toBeInTheDocument();
    fireEvent.click(getByTestId('commercialInternalize-toggle'));
    expect(
      queryByTestId('commercialInternalize-reason-textarea'),
    ).toBeInTheDocument();
  });

  it('should be able to fill the reason textarea and send it to store', async () => {
    const { getByTestId } = render(<CommercialInternalize />);
    fireEvent.change(getByTestId('commercialInternalize-toggle'));
    fireEvent.change(getByTestId('commercialInternalize-reason-textarea'), {
      target: { value: 'teste' },
    });
    expect(store.getState().issuance.forceInternalize).toBe(true);
    expect(store.getState().issuance.internalizeReason).toBe('teste');
  });

  it('Should delete all uploaded proposal documents on toggle change', async () => {
    jest
      .spyOn(ProposalDocumentsApi, 'deleteAllProposalDocuments')
      .mockImplementation(async () => true);
    jest.spyOn(ProposalApi, 'putProposal').mockImplementation(async () => ({
      ProposalId: 12345,
      PolicyId: 11111,
      QuotationId: 12223,
      NewQuoterId: 123333,
      createdAt: '2024-01-01T12:00:00.000Z',
    }));
    store.dispatch(
      proposalDocumentsActions.setDocuments([
        {
          size: 12321312321,
          url: 'url',
          extension: 'pdf',
          filename: 'test2',
          metadata: null,
        },
      ]),
    );
    await store.dispatch(
      putProposal({ proposalId: 12345, proposalData: proposalMock }),
    );
    const { getByTestId } = render(<CommercialInternalize />);
    fireEvent.click(getByTestId('commercialInternalize-toggle'));
    expect(
      ProposalDocumentsApi.deleteAllProposalDocuments,
    ).toHaveBeenCalledTimes(1);
  });
});

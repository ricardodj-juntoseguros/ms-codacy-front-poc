import { store } from "../../../config/store";
import { getProposalDocuments, proposalDocumentsActions } from "./ProposalDocumentsSlice";
import ProposalDocumentsApi from "./ProposalDocumentsApi";

jest.mock('junto-design-system', () => {
  const original = jest.requireActual('junto-design-system');
  return {
    ...original,
    makeToast: jest.fn(),
  };
});

describe('ProposalDocumentsSlice', () => {
  const mockResult = [{
    size: 12321312321,
    url: 'url',
    extension: 'pdf',
    filename: 'test',
    metadata: null,
  }];

  beforeEach(() => {
    store.dispatch(proposalDocumentsActions.clearProposalDocuments());
  });

  it('should be able to update a proposal', async () => {
    const getProposalDocumentsMock = jest
      .spyOn(ProposalDocumentsApi, 'getProposalDocuments')
      .mockImplementation(() => Promise.resolve(mockResult));
    await store.dispatch(getProposalDocuments(12345));
    const { proposalDocuments } = store.getState();
    expect(getProposalDocumentsMock).toHaveBeenCalled();
    expect(getProposalDocumentsMock).toHaveBeenCalledWith(12345);
    expect(proposalDocuments.proposalDocuments).toEqual([{
      size: 12321312321,
      url: 'url',
      name: 'test',
    }]);
  });

  it('Should not update the store if the call returns an error', async () => {
    const getProposalDocumentsMock = jest
      .spyOn(ProposalDocumentsApi, 'getProposalDocuments')
      .mockImplementation(() => Promise.reject(new Error('Not found')));
    await store.dispatch(getProposalDocuments(12345));
    const { proposalDocuments } = store.getState();
    expect(getProposalDocumentsMock).toHaveBeenCalled();
    expect(getProposalDocumentsMock).toHaveBeenCalledWith(12345);
    expect(proposalDocuments.proposalDocuments).toEqual([]);
  });

  it('should be able to set proposal documents', async () => {
    store.dispatch(proposalDocumentsActions.setDocuments(mockResult));
    const { proposalDocuments } = store.getState();
    expect(proposalDocuments.proposalDocuments).toEqual(mockResult);
  });

  it('should be able to set proposal documents loading', async () => {
    store.dispatch(proposalDocumentsActions.setLoadingDocuments(true));
    const { proposalDocuments } = store.getState();
    expect(proposalDocuments.loadingDocuments).toEqual(true);
  });

  it('should be to clear proposal documents', async () => {
    store.dispatch(proposalDocumentsActions.setLoadingDocuments(true));
    store.dispatch(proposalDocumentsActions.setDocuments(mockResult));
    store.dispatch(proposalDocumentsActions.clearProposalDocuments());
    const { proposalDocuments } = store.getState();
    expect(proposalDocuments.proposalDocuments).toEqual([]);
    expect(proposalDocuments.loadingDocuments).toEqual(false);
  });
});

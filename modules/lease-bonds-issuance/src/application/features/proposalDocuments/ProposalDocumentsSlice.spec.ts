import { store } from '../../../config/store';
import {
  getInternalizeDocumentList,
  getProposalDocuments,
  proposalDocumentsActions,
} from './ProposalDocumentsSlice';
import ProposalDocumentsApi from './ProposalDocumentsApi';

jest.mock('junto-design-system', () => {
  const original = jest.requireActual('junto-design-system');
  return {
    ...original,
    makeToast: jest.fn(),
  };
});

describe('ProposalDocumentsSlice', () => {
  const mockResult = [
    {
      size: 12321312321,
      url: 'url',
      extension: 'pdf',
      filename: 'test',
      metadata: null,
    },
  ];

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
    expect(proposalDocuments.proposalDocuments).toEqual([
      {
        size: 12321312321,
        url: 'url',
        name: 'test',
      },
    ]);
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

  it('should be able to get the documents list to internalize', async () => {
    const mockData = [
      {
        documentId: 8,
        name: 'Edital de licitação',
        description:
          'Edital de Licitação com todos os anexos ou a Carta Convite Minuta do Contrato',
        required: true,
      },
      {
        documentId: 9,
        name: 'Minuta do Termo de Constituição',
        description:
          'Em caso de consórcio, envie a Minuta do Termo de Constituição de Consórcio ou da SPE',
        required: true,
      },
    ];
    const getProposalDocumentsMock = jest
      .spyOn(ProposalDocumentsApi, 'getDocumentsToInternalize')
      .mockImplementation(async () => mockData);
    await store.dispatch(getInternalizeDocumentList(99));
    const { proposalDocuments } = store.getState();
    expect(getProposalDocumentsMock).toHaveBeenCalled();
    expect(getProposalDocumentsMock).toHaveBeenCalledWith(99);
    expect(proposalDocuments.internalizeDocumentsList).toEqual([
      {
        documentId: 8,
        description:
          'Edital de Licitação com todos os anexos ou a Carta Convite Minuta do Contrato',
      },
      {
        documentId: 9,
        description:
          'Em caso de consórcio, envie a Minuta do Termo de Constituição de Consórcio ou da SPE',
      },
    ]);
  });
});

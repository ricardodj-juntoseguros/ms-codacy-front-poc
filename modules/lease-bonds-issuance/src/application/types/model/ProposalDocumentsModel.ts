export interface ProposalDocumentsModel {
  proposalDocuments: {
    name: string;
    url: string;
    size: number;
  }[];
  loadingDocuments: boolean;
  loadingInternalizeDocumentsList: boolean;
  internalizeDocumentsList: {
    documentId: number;
    description: string;
  }[];
}

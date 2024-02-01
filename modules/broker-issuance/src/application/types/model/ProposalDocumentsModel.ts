export interface ProposalDocumentsModel {
  proposalDocuments: {
    name: string;
    url: string;
    size: number;
  }[];
  loadingDocuments: boolean;
}

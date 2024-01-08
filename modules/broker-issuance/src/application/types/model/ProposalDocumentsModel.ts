import { ProposalDocumentDTO } from "../dto/ProposalDocumentDTO";

export interface ProposalDocumentsModel {
  proposalDocuments: ProposalDocumentDTO[];
  loadingDocuments: boolean;
}

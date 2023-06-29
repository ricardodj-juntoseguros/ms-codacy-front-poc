import { ProposalDTO } from './ProposalDTO';

export interface ProposalListDTO {
  totalCount: number;
  currentPage: number;
  hasMore: boolean;
  data: ProposalDTO[];
}

import { SearchOptions } from 'junto-design-system';

export interface ProposalModel {
  contractNumber: string;
  contractValue: number;
  hasProject: boolean;
  project: SearchOptions | null;
}

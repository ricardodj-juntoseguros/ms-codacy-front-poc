import { SubmodalityDTO } from './SubmodalityDTO';

export interface ModalityDTO {
  id: number;
  newQuoterId: number;
  description: string;
  labelNoticeContract: string;
  labelNoticeAnnex: string;
  helpNoticeContract: string;
  helpNoticeAnnex: string;
  isJudicial: boolean;
  showAuctionNoticeFields: boolean;
  submodalityIdForCoverageLabor: number;
  typeModalityId: number;
  typeModalityDescription: string;
  submodalities: SubmodalityDTO[];
  needAcceptAdditionalCoverageLabor: boolean;
  showSpecialClause: boolean;
  labelSpecialClause: string | null;
  isSubstitute: boolean;
  allowsAdditionalCoverageLabor: boolean;
  allowsAdditionalCoverageVigilance: boolean;
  retroactiveDays: number;
}

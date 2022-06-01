import { SubmodalityDTO } from './SubmodalityDTO';

export interface ModalityDTO {
  id: number;
  description: string;
  externalId: number;
  allowsAdditionalCoverageGuarantee: boolean;
  allowsAdditionalCoverageLabor: boolean;
  allowsAdditionalCoverageVigilance: boolean;
  externalDescription: string;
  helpNoticeAnnex?: string;
  helpNoticeContract?: string;
  isJudicial: boolean;
  isSubstitute: boolean;
  labelNoticeAnnex?: string;
  labelNoticeContract?: string;
  labelSpecialClause?: string;
  needAcceptAdditionalCoverageLabor: boolean;
  retroactiveDays: number;
  showAuctionNoticeFields: boolean;
  showSpecialClause: boolean;
  submodalities: SubmodalityDTO[];
  submodalityExternalIdForCoverageGuarantee: number;
  submodalityExternalIdForCoverageLabor: number;
  typeDescription: string;
  typeId: number;
}

export interface SubmodalityDTO {
  id: number;
  modalityId: number;
  description: string;
  externalId: number;
  useBill: boolean;
  isSubstitute: boolean;
  isRecursal: boolean;
  appealJudicialPremium: boolean;
}

export interface ModalityDTO {
  id: number;
  description: string;
  externalDescription?: string;
  externalId?: number;
  labelNoticeContract?: string;
  labelNoticeAnnex?: string;
  helpNoticeContract?: string;
  helpNoticeAnnex?: string;
  isJudicial?: boolean;
  allowsAdditionalCoverageLabor?: boolean;
  allowsAdditionalCoverageGuarantee?: boolean;
  allowsAdditionalCoverageVigilance?: boolean;
  retroactiveDays?: number;
  showAuctionNoticeFields?: boolean;
  submodalityExternalIdForCoverageLabor?: number;
  submodalityExternalIdForCoverageGuarantee?: number;
  typeId?: number;
  typeDescription?: string;
  submodalities?: SubmodalityDTO[];
  needAcceptAdditionalCoverageLabor?: boolean;
  showSpecialClause?: boolean;
  labelSpecialClause?: string;
  isSubstitute?: boolean;
}

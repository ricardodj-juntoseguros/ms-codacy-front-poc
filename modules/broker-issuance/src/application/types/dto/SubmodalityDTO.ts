export interface SubmodalityDTO {
  description: string;
  externalDescription: string;
  externalId: number;
  id: number;
  isRecursal: boolean;
  isSubstitute: boolean;
  modalityId: number;
  useBill: boolean;
  appealJudicialPremium?: {
    judicialDurationInDays: number;
    securedAmountStart: number;
    submodalityId: number;
  }[];
}

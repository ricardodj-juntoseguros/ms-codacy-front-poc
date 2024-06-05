interface Payments {
  id: number;
  description: string;
}

interface AppealJudicialPremium {
  judicialDurationInDays: number;
  securedAmountStart: number;
}

export interface SubmodalityDTO {
  id: number;
  newQuoterId: number;
  description: string;
  useBill: boolean;
  isSubstitute: boolean;
  isRecursal: boolean;
  payments: Payments[];
  appealJudicialPremium: AppealJudicialPremium[] | null;
}

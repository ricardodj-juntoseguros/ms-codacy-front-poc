import { PricingDTO } from './PricingDTO';

export interface QuoteResultDTO {
  quote: {
    identification: {
      name: string;
      value: number;
    }[];
    policyholder: {
      federalId: string;
      affiliateFederalId: string | null;
    };
    broker: {
      federalId: string;
    };
    user: string;
    modality: {
      id: number;
      subModalityId: number;
    };
    validity: {
      startDate: string;
      durationInDays: number;
      endDate: string;
    };
    securedAmount: number;
    commissionFlex: number | null;
    feeFlex: number | null;
    proposalFee: number | null;
    additionalCoverage: {
      labor: boolean;
      vigilance: boolean;
      guarantee: boolean;
    };
    numberOfInstallments: number;
    originSystemId: number;
    documentType: number;
    paymentType: number;
    totalPrize: number;
    commissionValue: number;
  };
  pricing: PricingDTO;
}

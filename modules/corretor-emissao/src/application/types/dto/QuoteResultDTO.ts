export interface QuoteResultDTO {
  finalPrize: number;
  commissionFee: number;
  commissionValue: number;
  feeStandard: number;
  maxRate: number;
  installments: [];
  quoteFileRequestURL: string;
}

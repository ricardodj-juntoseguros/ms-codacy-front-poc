export interface ValidateBankAccountDTO {
  federalId: string;
  bankCode: string;
  agency: string;
  account: string;
  accountDigit: string;
  accountType: number;
}

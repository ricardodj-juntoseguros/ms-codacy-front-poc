export interface SubmitToApprovalOrIssuanceResultDTO {
  createdAt: string;
  issued: boolean;
  issuedAt: string | null;
  protocols: {
    number: string;
    dateTime: string;
    text: string;
  }[];
  status: number;
};

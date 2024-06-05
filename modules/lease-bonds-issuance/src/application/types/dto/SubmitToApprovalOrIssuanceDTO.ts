export interface SubmitToApprovalOrIssuanceDTO {
  isAutomatic: boolean,
  internalizedReason: string,
  comments: string,
  contacts: string[],
  acceptTermsId: string | null,
  approvalContacts: string[],
}

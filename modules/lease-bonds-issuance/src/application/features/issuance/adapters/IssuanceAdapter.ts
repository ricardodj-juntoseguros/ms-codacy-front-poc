import { SubmitToApprovalOrIssuanceDTO } from "../../../types/dto";

export const issuanceAdapter = (comments = '', contacts: string[], approvalContacts: string[], typeOfAuthorization: string): SubmitToApprovalOrIssuanceDTO => {
  return {
    isAutomatic: true,
    internalizedReason: '',
    comments,
    contacts,
    acceptTermsId: null,
    approvalContacts: typeOfAuthorization === 'sendToApproval' ? approvalContacts : [],
  };
};

import { SubmitToApprovalOrIssuanceDTO } from '../../../types/dto';

export const issuanceAdapter = (
  comments = '',
  contacts: string[],
  approvalContacts: string[],
  typeOfAuthorization: string,
  forcedInternalize: boolean,
  internalizedReason: string,
): SubmitToApprovalOrIssuanceDTO => {
  return {
    isAutomatic: !forcedInternalize,
    internalizedReason: forcedInternalize
      ? `PALAVRAS DO COMERCIAL: ${internalizedReason}`
      : '',
    comments,
    contacts,
    acceptTermsId: null,
    approvalContacts:
      !forcedInternalize && typeOfAuthorization === 'sendToApproval'
        ? approvalContacts
        : [],
  };
};

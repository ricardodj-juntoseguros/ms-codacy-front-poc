import { SubmitToApprovalOrIssuanceDTO } from '../../../types/dto';

export const issuanceAdapter = (
  comments = '',
  contacts: string[],
  approvalContacts: string[],
  typeOfAuthorization: string,
  forcedInternalize: boolean,
  internalizedReason: string,
  specialAnalysisRequired: boolean,
  specialAnalysisDescription: string,
): SubmitToApprovalOrIssuanceDTO => {
  const commentsAndAnalysisDescription: string = specialAnalysisRequired
    ? `${comments}${
        specialAnalysisDescription.length < 250
          ? ` ${specialAnalysisDescription}`
          : specialAnalysisDescription
      }`
    : comments;

  return {
    isAutomatic: !forcedInternalize,
    internalizedReason: forcedInternalize
      ? `PALAVRAS DO COMERCIAL: ${internalizedReason}`
      : '',
    comments: commentsAndAnalysisDescription,
    contacts,
    acceptTermsId: null,
    approvalContacts:
      !forcedInternalize && typeOfAuthorization === 'sendToApproval'
        ? approvalContacts
        : [],
  };
};

import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { BrokerPlatformAuthService, ProfileEnum } from '@services';
import { Button, LinkButton } from 'junto-design-system';
import { selectProposal } from '../../../application/features/proposal/ProposalSlice';
import { selectProposalDocuments } from '../../../application/features/proposalDocuments/ProposalDocumentsSlice';
import { selectCommercialAuthorization } from '../../../application/features/CommercialAuthorization/CommercialAuthorizationSlice';
import { selectQuote } from '../../../application/features/quote/QuoteSlice';
import { selectValidation } from '../../../application/features/validation/ValidationSlice';
import { selectIssuance } from '../../../application/features/issuance/IssuanceSlice';
import { POLICYHOLDER_ISSUE_PERMISSION } from '../../../constants';
import TermsOfAcceptanceModal from '../TermsOfAcceptanceModal';
import styles from './AdditionalDataFooter.module.scss';

const AdditionalDataFooter: React.FC = () => {
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const {
    identification,
    isAutomaticPolicy,
    firstDueDate,
    numberOfInstallments,
    loadingProposal,
  } = useSelector(selectProposal);
  const { loadingQuote } = useSelector(selectQuote);
  const { proposalDocuments } = useSelector(selectProposalDocuments);
  const { approvalContacts, documentsForAuthorization, typeOfAuthorization } =
    useSelector(selectCommercialAuthorization);
  const { errors } = useSelector(selectValidation);
  const { loadingIssuance, forceInternalize, internalizeReason } =
    useSelector(selectIssuance);
  const userProfile = BrokerPlatformAuthService.getUserProfile();

  const disabledSubmitButton = useMemo(() => {
    const isFormIncomplete =
      !identification || !numberOfInstallments || !firstDueDate;

    const hasErrors = Object.keys(errors).length > 0;

    const hasNotUploadedDocuments =
      (!isAutomaticPolicy || forceInternalize) &&
      proposalDocuments.length === 0;

    const forcedInternalizeButNoReason =
      forceInternalize &&
      (!internalizeReason || internalizeReason?.trim().length === 0);

    const isLoadingQuoteOrProposal = loadingQuote || loadingProposal;

    const hasNotCompletedAuthorization =
      userProfile === ProfileEnum.COMMERCIAL &&
      isAutomaticPolicy &&
      !forceInternalize &&
      ((typeOfAuthorization === 'hasAuthorization' &&
        documentsForAuthorization.length === 0) ||
        (typeOfAuthorization === 'sendToApproval' &&
          approvalContacts.length === 0));

    return (
      isFormIncomplete ||
      hasErrors ||
      hasNotUploadedDocuments ||
      forcedInternalizeButNoReason ||
      isLoadingQuoteOrProposal ||
      hasNotCompletedAuthorization
    );
  }, [
    userProfile,
    firstDueDate,
    identification,
    isAutomaticPolicy,
    numberOfInstallments,
    proposalDocuments,
    errors,
    loadingQuote,
    loadingProposal,
    typeOfAuthorization,
    approvalContacts,
    documentsForAuthorization,
    forceInternalize,
    internalizeReason,
  ]);

  const handleCertificateRegularity = () => {
    window.open(`${process.env.NX_GLOBAL_CERTIFICATE_REGULARITY}`, '_blank');
  };

  const renderLabelButton = () => {
    let label = 'Emitir';
    if (!isAutomaticPolicy || forceInternalize) label = 'Finalizar inclusão';
    if (
      (userProfile === ProfileEnum.COMMERCIAL &&
        isAutomaticPolicy &&
        !forceInternalize &&
        typeOfAuthorization === 'sendToApproval') ||
      (userProfile === ProfileEnum.POLICYHOLDER &&
        !BrokerPlatformAuthService.userHasPermission(
          POLICYHOLDER_ISSUE_PERMISSION,
        ))
    )
      label = 'Enviar para aprovação';
    return label;
  };

  return (
    <footer className={styles['additional-data-footer__wrapper']}>
      <div className={styles['additional-data-footer__link-wrapper']}>
        <LinkButton
          id="additionalDataForm-certificate-regularity-button"
          data-testid="additionalDataForm-certificate-regularity-button"
          onClick={() => handleCertificateRegularity()}
          label="Certificado de regularidade"
          icon="download"
          iconPosition="left"
        />
        <LinkButton
          id="additionalDataForm-terms-modal-button"
          data-testid="additionalDataForm-terms-modal-button"
          onClick={() => setIsTermsModalOpen(true)}
          label="Termos e condições"
          icon="download"
          iconPosition="left"
        />
      </div>
      <Button
        id="additionalDataForm-submit-button"
        data-testid="additionalDataForm-submit-button"
        type="submit"
        size="large"
        disabled={disabledSubmitButton}
        loading={loadingIssuance}
      >
        {renderLabelButton()}
      </Button>
      <TermsOfAcceptanceModal
        isModalOpen={isTermsModalOpen}
        onToggleModal={setIsTermsModalOpen}
      />
    </footer>
  );
};

export default AdditionalDataFooter;

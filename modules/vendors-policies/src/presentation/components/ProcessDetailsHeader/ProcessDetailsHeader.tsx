import { useCallback, useContext, useMemo, useState } from 'react';
import className from 'classnames';
import { format } from 'date-fns';
import { Button, ThemeContext, makeToast } from 'junto-design-system';
import { downloadFile } from '@shared/utils';
import { UserTypeEnum } from '@services';
import { ProposalStatusEnum } from '../../../application/types/model';
import DocumentAPI from '../../../application/features/document/DocumentAPI';
import styles from './ProcessDetailsHeader.module.scss';

export interface ProcessDetailsHeaderProps {
  processStatusConfig: any;
  policyId: number;
  proposalId: number;
  createdAt: string;
  policyNumber?: string;
  dateIssuance?: string | null;
  userType: string | null;
}

const ProcessDetailsHeader: React.FC<ProcessDetailsHeaderProps> = ({
  processStatusConfig,
  policyId,
  proposalId,
  createdAt,
  policyNumber,
  dateIssuance,
  userType,
}) => {
  const [isLoadingDocument, setIsLoadingDocumentDocument] = useState(false);
  const theme = useContext(ThemeContext);
  const {
    detailsMessage,
    detailsIcon,
    name: statusName,
    id: statusId,
    detailsMessagePolicyholder,
  } = processStatusConfig;

  const formattedCreatedAt = useMemo(
    () => format(new Date(createdAt), "dd/MM/yyyy 'às' HH'h'mm"),
    [createdAt],
  );

  const formattedDateIssuance = useMemo(
    () => dateIssuance && format(new Date(dateIssuance), 'dd/MM/yyyy'),
    [dateIssuance],
  );

  const handleDownloadPolicyDocument = useCallback(() => {
    setIsLoadingDocumentDocument(true);
    DocumentAPI.getPolicyDocument(policyId)
      .then((response: any) => {
        downloadFile(response.linkDocumento);
      })
      .catch(error => makeToast('error', error.data.data.message))
      .finally(() => setIsLoadingDocumentDocument(false));
  }, [policyId]);

  const handleDownloadProposalDocument = useCallback(() => {
    setIsLoadingDocumentDocument(true);
    DocumentAPI.getProposalDocument(proposalId)
      .then((result: any) => {
        const file = new Blob([result], {
          type: 'application/pdf'
        });
        downloadFile(file, `proposta_${policyId}.pdf`);
      })
      .catch(error => makeToast('error', error.data.data.message))
      .finally(() => setIsLoadingDocumentDocument(false));
  }, [proposalId, policyId]);

  const renderDownloadPolicyDocumentButton = () => {
    const isPolicy =  [
      ProposalStatusEnum.ISSUED,
      ProposalStatusEnum.TO_EXPIRE,
      ProposalStatusEnum.EXPIRED,
    ].includes(statusId);
    const isProposal = [
      ProposalStatusEnum.ANALYSIS,
      ProposalStatusEnum.AWAITING_APPROVAL,
    ].includes(statusId);

    if(isPolicy || isProposal) {
      return (
        <Button
          data-testid="processDetailsHeader-button-download-action"
          type="button"
          onClick={() => isPolicy ? handleDownloadPolicyDocument() : handleDownloadProposalDocument()}
          variant={isPolicy ? "primary" : "secondary"}
          size='medium'
          disabled={isLoadingDocument}
        >
          {isPolicy ? "Baixar apólice" : "Baixar proposta"}
        </Button>
      );
    }

    return null;
  };

  const renderTitle = () => {
    const isProposal = [
      ProposalStatusEnum.ANALYSIS,
      ProposalStatusEnum.READY_TO_ISSUE,
      ProposalStatusEnum.AWAITING_APPROVAL,
      ProposalStatusEnum.REFUSED,
      ProposalStatusEnum.IN_PROGRESS,
    ].includes(statusId);

    const title = isProposal
      ? `Solicitação ${policyId}`
      : `Apólice ${policyNumber}`;
    const text = isProposal
      ? `Proposta ${policyId}, ${formattedCreatedAt}`
      : `Contratada em ${formattedDateIssuance}`;

    return (
      <>
        <h1
          className={className(
            styles['process-details-header__title'],
            styles[theme],
          )}
        >
          {title}
        </h1>
        <p
          className={className(
            styles['process-details-header__text'],
            styles[theme],
          )}
        >
          {text}
        </p>
      </>
    );
  };

  return (
    <>
      {renderTitle()}
      {renderDownloadPolicyDocumentButton()}
      <p
        data-testid="processDetailsHeader-paragraph-status"
        className={className(
          styles['process-details-header__status'],
          styles[`process-details-header__status--${statusName}`],
          styles[theme],
        )}
      >
        <i className={`icon icon-${detailsIcon}`} />
        {userType === UserTypeEnum.POLICYHOLDER
          ? detailsMessagePolicyholder
          : detailsMessage}
      </p>
    </>
  );
};

export default ProcessDetailsHeader;

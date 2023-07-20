import { useCallback, useContext, useMemo } from 'react';
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
  createdAt: string;
  policyNumber?: string;
  dateIssuance?: string | null;
  userType: string | null;
}

const ProcessDetailsHeader: React.FC<ProcessDetailsHeaderProps> = ({
  processStatusConfig,
  policyId,
  createdAt,
  policyNumber,
  dateIssuance,
  userType,
}) => {
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
    DocumentAPI.getPolicyDocument(policyId)
      .then((response: any) => {
        downloadFile(response.linkDocumento);
      })
      .catch(error => makeToast('error', error.data.data.message));
  }, [policyId]);

  const renderDownloadPolicyDocumentButton = () => {
    if (
      [
        ProposalStatusEnum.ISSUED,
        ProposalStatusEnum.TO_EXPIRE,
        ProposalStatusEnum.EXPIRED,
      ].includes(statusId)
    ) {
      return (
        <Button
          data-testid="processDetailsHeader-button-download-policy"
          type="button"
          onClick={() => handleDownloadPolicyDocument()}
        >
          Baixar apólice
        </Button>
      );
    }

    return null;
  };

  const renderTitle = () => {
    const isProposal = [
      ProposalStatusEnum.ANALYSIS,
      ProposalStatusEnum.AWAITING_APPROVAL,
      ProposalStatusEnum.REFUSED,
      ProposalStatusEnum.IN_PROGRESS,
    ].includes(statusId);

    const title = isProposal
      ? `Solicitação ${policyId}`
      : `Apólice ${policyNumber}`;
    const text = isProposal
      ? `Proposta ${policyId}, ${formattedCreatedAt}`
      : `Contratada em, ${formattedDateIssuance}`;

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

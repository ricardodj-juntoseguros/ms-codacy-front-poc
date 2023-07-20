import className from 'classnames';
import { useContext } from 'react';
import { ThemeContext } from 'junto-design-system';
import { ProposalStatusEnum } from '../../../application/types/model';

import styles from './ProcessDetailsFooter.module.scss';

export interface ProcessDetailsFooterProps {
  processStatusConfig: any;
  userType: string | null;
}

const ProcessDetailsFooter: React.FC<ProcessDetailsFooterProps> = ({
  processStatusConfig,
  userType,
}) => {
  const theme = useContext(ThemeContext);
  const { id: statusId } = processStatusConfig;

  const handleNotifyIssuanceClaim = () => {
    window.open('https://www.juntoseguros.com/canal-de-sinistro/', '_blank');
  };

  const handleCertificateOfGoodStanding = () => {
    window.open(
      `${process.env.NX_GLOBAL_MS_DOCUMENTS}certificateRegularity/download?format=pdf`,
      '_blank',
    );
  };

  const renderNotifyInssuanceClaimButton = () => {
    if (
      [
        ProposalStatusEnum.ISSUED,
        ProposalStatusEnum.TO_EXPIRE,
        ProposalStatusEnum.EXPIRED,
      ].includes(statusId) &&
      userType !== 'policyholder'
    ) {
      return (
        <button
          data-testid="processDetailsFooterProps-button-issuance-claim"
          type="button"
          className={className(
            styles['process-details-footer__button'],
            styles[theme],
          )}
          onClick={() => handleNotifyIssuanceClaim()}
        >
          <i className="icon icon-arrow-up-right" />
          Avisar sinistro
        </button>
      );
    }

    return null;
  };

  return (
    <div className={styles['process-details-footer__actions']}>
      <button
        data-testid="processDetailsFooterProps-button-certificate"
        type="button"
        className={className(
          styles['process-details-footer__button'],
          styles[theme],
        )}
        onClick={() => handleCertificateOfGoodStanding()}
      >
        <i className="icon icon-arrow-up-right" />
        Certificado de regularidade
      </button>
      {renderNotifyInssuanceClaimButton()}
    </div>
  );
};

export default ProcessDetailsFooter;

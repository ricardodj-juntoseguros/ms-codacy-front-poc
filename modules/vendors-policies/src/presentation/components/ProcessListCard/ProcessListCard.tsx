import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { downloadFile, stringToInt } from '@shared/utils';
import {
  Button,
  LinkButton,
  ThemeContext,
  makeToast,
} from 'junto-design-system';
import DocumentAPI from '../../../application/features/document/DocumentAPI';
import { ProposalDTO } from '../../../application/types/dto';
import { PROCESS_STATUS } from '../../../constants';
import styles from './ProcessListCard.module.scss';
import { ProposalStatusEnum } from '../../../application/types/model';

interface ProcessListCardProps {
  proposal: ProposalDTO;
}

const ProcessListCard: React.FC<ProcessListCardProps> = ({ proposal }) => {
  const theme = useContext(ThemeContext);
  const navigate = useNavigate();
  const [openInfo, setOpenInfo] = useState<boolean>(false);
  const [isLoadingPolicy, setIsLoadingPolicy] = useState<boolean>(false);
  const {
    identification: { proposalId, policyid, policyNumber },
    insured,
    policyholder,
    product,
    status,
  } = proposal;
  const processStatusConfig =
    PROCESS_STATUS.find(pStatus => pStatus.id === status) || PROCESS_STATUS[0];

  const getStatusTagClassname = () => {
    const { name } = processStatusConfig;
    return `process-list-card__status-tag--${name}`;
  };

  const getStatusLabel = () => {
    const { cardTagLabel } = processStatusConfig;
    return cardTagLabel;
  };

  const handleDownloadPolicyDocument = () => {
    if (isLoadingPolicy) return;
    setIsLoadingPolicy(true);
    DocumentAPI.getPolicyDocument(stringToInt(`${policyid}`))
      .then((response: any) => {
        downloadFile(response.linkDocumento);
      })
      .catch(() => {
        makeToast('error', 'Ocorreu um erro ao baixar a apólice.');
      })
      .finally(() => setIsLoadingPolicy(false));
  };

  return (
    <div
      className={classNames(
        styles[theme],
        styles['process-list-card__wrapper'],
      )}
    >
      <div>
        <div className={styles['process-list-card__title-row']}>
          <span
            className={classNames(
              styles[theme],
              styles['process-list-card__status-tag'],
              styles[getStatusTagClassname()],
            )}
          >
            {getStatusLabel()}
          </span>
          <p
            className={classNames(
              styles[theme],
              styles['process-list-card__policyholder'],
            )}
          >
            {policyholder.companyName}
          </p>
        </div>
        <div
          className={classNames(styles['process-list-card__info-row'], {
            [styles['process-list-card__info-row--open']]: openInfo,
          })}
        >
          <div>
            <span
              className={classNames(
                styles[theme],
                styles['process-list-card__info-label'],
              )}
            >
              {[
                ProposalStatusEnum.ISSUED,
                ProposalStatusEnum.TO_EXPIRE,
                ProposalStatusEnum.EXPIRED,
                ProposalStatusEnum.CANCELLED,
              ].includes(status)
                ? 'Nº da apólice'
                : 'Nº da solicitação'}
            </span>
            <p
              className={classNames(
                styles[theme],
                styles['process-list-card__info-value'],
              )}
            >
              {policyNumber || policyid || proposalId}
            </p>
          </div>
          <div>
            <LinkButton
              icon={openInfo ? 'chevron-up' : 'chevron-down'}
              label=""
              size="large"
              onClick={() => setOpenInfo(!openInfo)}
            />
          </div>
          <div>
            <span
              className={classNames(
                styles[theme],
                styles['process-list-card__info-label'],
              )}
            >
              Segurado
            </span>
            <p
              className={classNames(
                styles[theme],
                styles['process-list-card__info-value'],
              )}
            >
              {insured ? insured.companyName : ''}
            </p>
          </div>
          <div>
            <span
              className={classNames(
                styles[theme],
                styles['process-list-card__info-label'],
              )}
            >
              Modalidade
            </span>
            <p
              className={classNames(
                styles[theme],
                styles['process-list-card__info-value'],
              )}
            >
              {product.modality}
            </p>
          </div>
        </div>
      </div>
      <div
        className={classNames(styles['process-list-card__buttons'], {
          [styles['process-list-card__buttons--loading']]: isLoadingPolicy,
        })}
      >
        {[
          ProposalStatusEnum.ISSUED,
          ProposalStatusEnum.TO_EXPIRE,
          ProposalStatusEnum.EXPIRED,
        ].includes(status) && (
          <LinkButton
            data-testid={`processListCard-button-${proposalId}-download`}
            label={isLoadingPolicy ? 'Aguarde...' : 'Baixar apólice'}
            icon={isLoadingPolicy ? 'loading' : 'download'}
            onClick={() => handleDownloadPolicyDocument()}
          />
        )}
        <Button
          data-testid={`processListCard-button-${proposalId}-details`}
          size="small"
          onClick={() => navigate(`/details/${proposalId}`)}
        >
          Mais detalhes
        </Button>
      </div>
    </div>
  );
};

export default ProcessListCard;

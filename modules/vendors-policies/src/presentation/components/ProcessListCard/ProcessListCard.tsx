import { useContext, useState } from 'react';
import { useHistory } from 'react-router';
import classNames from 'classnames';
import { Button, LinkButton, ThemeContext } from 'junto-design-system';
import { ProposalDTO } from '../../../application/types/dto';
import { PROCESS_STATUS } from '../../../constants';
import styles from './ProcessListCard.module.scss';

interface ProcessListCardProps {
  proposal: ProposalDTO;
}

const ProcessListCard: React.FC<ProcessListCardProps> = ({ proposal }) => {
  const theme = useContext(ThemeContext);
  const history = useHistory();
  const [openInfo, setOpenInfo] = useState<boolean>(false);
  const {
    identification: { proposalId, policyid, policyNumber },
    insured,
    policyholder,
    product,
    status,
  } = proposal;

  const getStatusTagClassname = () => {
    const name = PROCESS_STATUS.find(pStatus => pStatus.id === status)?.name;
    return `process-list-card__status-tag--${name}`;
  };

  const getStatusLabel = () => {
    const pStatus = PROCESS_STATUS.find(pStatus => pStatus.id === status);
    return pStatus ? pStatus.cardTagLabel : '';
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
              {[4, 5, 6, 8].includes(status)
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
              {insured.companyName}
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
      <div>
        {[4, 5, 6].includes(status) && (
          <LinkButton
            data-testid={`processListCard-button-${proposalId}-download`}
            label="Baixar apólice"
            icon="download"
            onClick={() => alert('Baixar apólice')}
          />
        )}
        <Button
          data-testid={`processListCard-button-${proposalId}-details`}
          size="small"
          onClick={() => history.push(`/details/${proposalId}`)}
        >
          Mais detalhes
        </Button>
      </div>
    </div>
  );
};

export default ProcessListCard;

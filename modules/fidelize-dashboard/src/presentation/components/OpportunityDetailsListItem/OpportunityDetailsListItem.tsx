import { format, isAfter } from 'date-fns';
import brLocale from 'date-fns/locale/pt-BR';
import classNames from 'classnames';
import { thousandSeparator } from '@shared/utils';
import styles from './OpportunityDetailsListItem.module.scss';
import {
  ModalityEnum,
  OpportunityRelevanceEnum,
} from '../../../application/types/model';
import MoreOpportunityDetailsModal from '../MoreOpportunityDetailsModal';

interface OpportunityDetailsListItemProps {
  modality: ModalityEnum;
  relevance: OpportunityRelevanceEnum;
  type: string;
  expiration: string | null;
  securityAmount: number;
  policyholder: string;
  mappingDate: string;
}

const OpportunityDetailsListItem: React.FC<OpportunityDetailsListItemProps> = ({
  modality,
  relevance,
  type,
  expiration,
  securityAmount,
  policyholder,
  mappingDate,
}) => {
  const isExpiredOpportunity =
    expiration !== null ? isAfter(new Date(), new Date(expiration)) : false;

  const getExpirationLabel = () => {
    if (!expiration) return 'Prazo indeterminado';
    const expirationFormatted = formatDate(expiration);
    return isExpiredOpportunity
      ? `Expirada em ${expirationFormatted}`
      : `Com vencimento em ${expirationFormatted}`;
  };

  const getRelevanceTagClassName = (relevance: OpportunityRelevanceEnum) => {
    if (isExpiredOpportunity)
      return styles['opportunity-details-listitem__relevance-tag--expired'];
    switch (relevance) {
      case OpportunityRelevanceEnum.HIGH:
        return styles['opportunity-details-listitem__relevance-tag--high'];
      case OpportunityRelevanceEnum.MEDIUM:
        return styles['opportunity-details-listitem__relevance-tag--medium'];
      case OpportunityRelevanceEnum.LOW:
        return styles['opportunity-details-listitem__relevance-tag--low'];
      default:
        return null;
    }
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'dd/MMM/yy', {
      locale: brLocale,
    }).toLowerCase();
  };

  return (
    <div
      className={classNames(styles['opportunity-details-listitem__wrapper'], {
        [styles['opportunity-details-listitem__wrapper--expired']]:
          isExpiredOpportunity,
      })}
    >
      <div className={styles['opportunity-details-listitem__column']}>
        <span
          className={classNames(
            styles['opportunity-details-listitem__relevance-tag'],
            getRelevanceTagClassName(relevance),
          )}
        >
          {isExpiredOpportunity ? 'Expirada' : relevance}
        </span>
      </div>
      <div className={styles['opportunity-details-listitem__column']}>
        <p className={styles['opportunity-details-listitem__label']}>{type}</p>
        <span className={styles['opportunity-details-listitem__label-helper']}>
          {getExpirationLabel()}
        </span>
      </div>
      <div className={styles['opportunity-details-listitem__column']}>
        <p className={styles['opportunity-details-listitem__label']}>
          {thousandSeparator(securityAmount, '.', 2)}
        </p>
      </div>
      <div className={styles['opportunity-details-listitem__column']}>
        <p
          className={styles['opportunity-details-listitem__label-emphasys']}
          title={policyholder}
        >
          {policyholder}
        </p>
      </div>
      <div className={styles['opportunity-details-listitem__column']}>
        <p className={styles['opportunity-details-listitem__label']}>
          {formatDate(mappingDate)}
        </p>
      </div>
      <div className={styles['opportunity-details-listitem__column']}>
        <MoreOpportunityDetailsModal
          {...{
            modality,
            policyholder,
            relevance,
            securityAmount,
            type,
          }}
          mappingDate={formatDate(mappingDate)}
          expiration={getExpirationLabel()}
        />
      </div>
    </div>
  );
};

export default OpportunityDetailsListItem;

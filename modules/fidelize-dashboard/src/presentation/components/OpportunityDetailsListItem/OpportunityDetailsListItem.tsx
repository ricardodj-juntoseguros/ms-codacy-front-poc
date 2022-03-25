import { format, isAfter } from 'date-fns';
import brLocale from 'date-fns/locale/pt-BR';
import classNames from 'classnames';
import { thousandSeparator } from '@shared/utils';
import styles from './OpportunityDetailsListItem.module.scss';
import {
  ModalityEnum,
  OpportunityRelevanceEnum,
} from '../../../application/types/model';
import { OpportunityDetailsItemDTO } from '../../../application/types/dto';
import MoreOpportunityDetailsModal from '../MoreOpportunityDetailsModal';

interface OpportunityDetailsListItemProps {
  modality: ModalityEnum;
  opportunity: OpportunityDetailsItemDTO;
}

const OpportunityDetailsListItem: React.FC<OpportunityDetailsListItemProps> = ({
  modality,
  opportunity,
}) => {
  const {
    relevance,
    category,
    expiration,
    securityAmount,
    policyholder,
    mappingDate,
  } = opportunity;
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
        <p className={styles['opportunity-details-listitem__label']}>
          {category}
        </p>
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
          modality={modality}
          opportunity={{
            ...opportunity,
            mappingDate: formatDate(mappingDate),
            expiration: getExpirationLabel(),
          }}
        />
      </div>
    </div>
  );
};

export default OpportunityDetailsListItem;

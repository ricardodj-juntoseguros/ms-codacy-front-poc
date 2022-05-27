import { format } from 'date-fns';
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
    securityAmount,
    policyholder,
    mappingDate,
    expired,
    observation,
  } = opportunity;

  const getRelevanceTagClassName = (relevance: OpportunityRelevanceEnum) => {
    if (expired)
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
        [styles['opportunity-details-listitem__wrapper--expired']]: expired,
      })}
    >
      <div className={styles['opportunity-details-listitem__column']}>
        <span
          className={classNames(
            styles['opportunity-details-listitem__relevance-tag'],
            getRelevanceTagClassName(relevance),
          )}
        >
          {expired ? 'Expirada' : relevance}
        </span>
      </div>
      <div className={styles['opportunity-details-listitem__column']}>
        <p className={styles['opportunity-details-listitem__label']}>
          {category}
        </p>
        {observation !== null && (
          <span
            className={styles['opportunity-details-listitem__label-helper']}
          >
            {observation}
          </span>
        )}
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
          }}
        />
      </div>
    </div>
  );
};

export default OpportunityDetailsListItem;

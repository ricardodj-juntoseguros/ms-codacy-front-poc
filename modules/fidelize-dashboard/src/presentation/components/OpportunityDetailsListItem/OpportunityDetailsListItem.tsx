import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox } from 'junto-design-system';
import classNames from 'classnames';
import { thousandSeparator } from '@shared/utils';
import { OpportunityRelevanceEnum } from '../../../application/types/model';
import { OpportunityDetailsItemDTO } from '../../../application/types/dto';
import {
  opportunitiesDetailsActions,
  selectSelectedOpportunities,
} from '../../../application/features/opportunitiesDetails/OpportunitiesDetailsSlice';
import { formatDateString } from '../../../helpers';
import styles from './OpportunityDetailsListItem.module.scss';

interface OpportunityDetailsListItemProps {
  opportunity: OpportunityDetailsItemDTO;
  checkable: boolean;
  onMoreDetailsClick: (opportunity: OpportunityDetailsItemDTO) => void;
}

const OpportunityDetailsListItem: React.FC<OpportunityDetailsListItemProps> = ({
  opportunity,
  checkable,
  onMoreDetailsClick,
}) => {
  const dispatch = useDispatch();
  const selectedOpportunities = useSelector(selectSelectedOpportunities);
  const {
    id,
    relevance,
    category,
    securityAmount,
    policyholder,
    mappingDate,
    expired,
    observation,
  } = opportunity;

  const isOpportunitySelected = useMemo(
    () => selectedOpportunities.some(o => o.id === id),
    [selectedOpportunities, id],
  );

  const handleItemCheck = (checked: boolean) => {
    const action = checked
      ? opportunitiesDetailsActions.addOpportunityToSelection
      : opportunitiesDetailsActions.removeOpportunityFromSelection;
    dispatch(action(opportunity));
  };

  const getRelevanceTagClassName = (relevance: OpportunityRelevanceEnum) => {
    if (expired || relevance === OpportunityRelevanceEnum.EXPIRED)
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

  return (
    <div
      className={classNames(
        styles['opportunity-details-listitem__wrapper'],
        {
          [styles['opportunity-details-listitem__wrapper--expired']]:
            expired || relevance === OpportunityRelevanceEnum.EXPIRED,
        },
        {
          [styles['opportunity-details-listitem__wrapper--selected']]:
            isOpportunitySelected,
        },
      )}
    >
      <div className={styles['opportunity-details-listitem__column']}>
        {checkable && (
          <Checkbox
            id={`chk-${id}`}
            checked={isOpportunitySelected}
            title="Selecionar oportunidade"
            onChange={v => handleItemCheck(v)}
          />
        )}
      </div>
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
          {formatDateString(mappingDate, 'dd/MMM/yy')}
        </p>
        {selectedOpportunities.length === 0 && (
          <button
            data-testid="modal-trigger"
            type="button"
            className={styles['opportunity-details-listitem__modal-trigger']}
            onClick={() => onMoreDetailsClick(opportunity)}
          >
            <i className="icon icon-plus-circle" />
          </button>
        )}
      </div>
    </div>
  );
};

export default OpportunityDetailsListItem;

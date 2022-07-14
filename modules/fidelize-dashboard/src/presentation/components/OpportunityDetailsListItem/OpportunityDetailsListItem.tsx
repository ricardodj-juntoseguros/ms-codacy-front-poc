import { useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, Tooltip } from 'junto-design-system';
import classNames from 'classnames';
import { thousandSeparator } from '@shared/utils';
import {
  OpportunityDetailsCategoryEnum,
  OpportunityRelevanceEnum,
} from '../../../application/types/model';
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
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const approximateIconRef = useRef<HTMLSpanElement>(null);
  const valueToDefineIconRef = useRef<HTMLSpanElement>(null);
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

  const isNewIssue = category === OpportunityDetailsCategoryEnum.NEW_ISSUE;
  const isValueToDefine = isNewIssue && securityAmount === null;

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

  const renderSecurityAmountColumn = () => {
    const labelContent = isValueToDefine
      ? 'Valor a definir'
      : thousandSeparator(securityAmount, '.', 2);

    return !isNewIssue ? (
      labelContent
    ) : (
      <>
        {isValueToDefine ? labelContent : ''}
        <span
          onMouseEnter={() => setTooltipVisible(true)}
          onMouseLeave={() => setTooltipVisible(false)}
          className={classNames(
            styles['opportunity-details-listitem__label-icon'],
            {
              [styles['opportunity-details-listitem__label-icon--info']]:
                isValueToDefine,
            },
          )}
          ref={isValueToDefine ? valueToDefineIconRef : approximateIconRef}
        >
          <i
            className={isValueToDefine ? 'icon-info' : 'icon-approximate-value'}
          />
        </span>
        {!isValueToDefine ? labelContent : ''}
      </>
    );
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
          {renderSecurityAmountColumn()}
        </p>
        <Tooltip
          anchorRef={
            isValueToDefine ? valueToDefineIconRef : approximateIconRef
          }
          text={
            isValueToDefine
              ? 'Valor a ser definido de acordo com o valor da sentença na fase de execução do processo.'
              : 'Valor aproximado'
          }
          visible={tooltipVisible}
          position="top"
        />
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

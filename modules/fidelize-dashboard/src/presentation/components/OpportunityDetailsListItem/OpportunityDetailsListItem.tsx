import { useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isAfter, isSameDay, startOfDay } from 'date-fns';
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
  lastBrokerAccessDate: Date | null;
}

const OpportunityDetailsListItem: React.FC<OpportunityDetailsListItemProps> = ({
  opportunity,
  checkable,
  onMoreDetailsClick,
  lastBrokerAccessDate,
}) => {
  const dispatch = useDispatch();
  const [securityAmountTooltipVisible, setSecurityAmountTooltipVisible] =
    useState(false);
  const [moreDetailsTooltipVisible, setMoreDetailsTooltipVisible] =
    useState(false);
  const [newOpportunityIconVisible, setNewOpportunityIconVisible] =
    useState(false);
  const approximateIconRef = useRef<HTMLSpanElement>(null);
  const valueToDefineIconRef = useRef<HTMLSpanElement>(null);
  const newOpportunityIconRef = useRef<HTMLSpanElement>(null);
  const moreDetailsButtonRef = useRef<HTMLButtonElement>(null);
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
    economicGroup,
    lastSolicitationDate,
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
          onMouseEnter={() => setSecurityAmountTooltipVisible(true)}
          onMouseLeave={() => setSecurityAmountTooltipVisible(false)}
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

  const renderNewOpportunityIcon = () => {
    let isNewOpportunity = true;

    if (lastBrokerAccessDate !== null) {
      const opportunityMappedDate = startOfDay(new Date(mappingDate));
      isNewOpportunity =
        isSameDay(opportunityMappedDate, lastBrokerAccessDate) ||
        isAfter(opportunityMappedDate, lastBrokerAccessDate);
    }

    return isNewOpportunity ? (
      <>
        <span
          ref={newOpportunityIconRef}
          data-testid={`new-opportunity-icon-${id}`}
          onMouseEnter={() => {
            setNewOpportunityIconVisible(true);
          }}
          onMouseLeave={() => {
            setNewOpportunityIconVisible(false);
          }}
          className={styles['opportunity-details-listitem__new-item']}
        />
      </>
    ) : (
      <div />
    );
  };

  return (
    <>
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
              title={
                category === OpportunityDetailsCategoryEnum.NEW_ISSUE
                  ? observation
                  : ''
              }
            >
              {observation}
            </span>
          )}
        </div>
        <div className={styles['opportunity-details-listitem__column']}>
          <p className={styles['opportunity-details-listitem__label']}>
            {renderSecurityAmountColumn()}
          </p>
        </div>
        <div className={styles['opportunity-details-listitem__column']}>
          <p
            className={styles['opportunity-details-listitem__label-emphasys']}
            title={policyholder}
          >
            {policyholder}
          </p>
          {economicGroup !== null && (
            <span
              className={styles['opportunity-details-listitem__label-helper']}
              title={economicGroup}
            >
              {economicGroup}
            </span>
          )}
        </div>
        <div className={styles['opportunity-details-listitem__column']}>
          {renderNewOpportunityIcon()}
          <p className={styles['opportunity-details-listitem__label']}>
            {formatDateString(mappingDate, 'dd/MMM/yy')}
          </p>
          <button
            type="button"
            data-testid="modal-trigger"
            className={styles['opportunity-details-listitem__modal-trigger']}
            ref={moreDetailsButtonRef}
            disabled={selectedOpportunities.length !== 0}
            onClick={() => onMoreDetailsClick(opportunity)}
            onMouseEnter={() => setMoreDetailsTooltipVisible(true)}
            onMouseLeave={() => setMoreDetailsTooltipVisible(false)}
          >
            {(!lastSolicitationDate || moreDetailsTooltipVisible) &&
              selectedOpportunities.length === 0 && (
                <i data-icon="plus" className="icon icon-plus-circle" />
              )}
            {!!lastSolicitationDate && !moreDetailsTooltipVisible && (
              <i data-icon="check" className="icon icon-check-circle" />
            )}
          </button>
        </div>
      </div>
      <Tooltip
        anchorRef={newOpportunityIconRef}
        text="Nova oportunidade"
        visible={newOpportunityIconVisible}
        position="top"
      />
      <Tooltip
        anchorRef={isValueToDefine ? valueToDefineIconRef : approximateIconRef}
        text={
          isValueToDefine
            ? 'Valor a ser definido de acordo com o valor da sentença na fase de execução do processo.'
            : `Valor aproximado considerando os valores recursais estipulados para cada tipo de recurso.
                 No entanto, caso o processo já esteja próximo da fase de execução, consideramos o valor
                 da sentença ou da própria execução.`
        }
        visible={securityAmountTooltipVisible}
        position="top"
      />
      <Tooltip
        anchorRef={moreDetailsButtonRef}
        text="Quero mais detalhes"
        visible={moreDetailsTooltipVisible}
        position="top"
      />
    </>
  );
};

export default OpportunityDetailsListItem;

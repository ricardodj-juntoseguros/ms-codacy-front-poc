import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox } from 'junto-design-system';
import classNames from 'classnames';
import {
  ModalityEnum,
  OpportunityDetailsOrderEnum,
} from '../../../application/types/model';
import { OpportunityDetailsItemDTO } from '../../../application/types/dto';
import {
  opportunitiesDetailsActions,
  selectSelectedOpportunities,
  selectSettingsByModality,
} from '../../../application/features/opportunitiesDetails/OpportunitiesDetailsSlice';
import styles from './OpportunityDetailsListHeader.module.scss';
import { renderOpportunitySelectionLossModal } from '../../../helpers';

export interface OpportunityDetailsListHeaderProps {
  modality: ModalityEnum;
  checkable: boolean;
  opportunities: OpportunityDetailsItemDTO[];
  loadingItems: boolean;
  totalOpportunities?: number;
}

const OpportunityDetailsListHeader: React.FC<OpportunityDetailsListHeaderProps> =
  ({
    modality,
    checkable,
    opportunities,
    loadingItems,
    totalOpportunities = 0,
  }) => {
    const selectionLossModalRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();
    const { orderBy, direction } = useSelector(
      selectSettingsByModality(modality),
    ) || {
      orderBy: OpportunityDetailsOrderEnum.RELEVANCE,
      direction: 'desc',
    };
    const selectedOpportunities = useSelector(selectSelectedOpportunities);
    const [checkboxStatus, setCheckboxStatus] = useState(false);

    useEffect(() => {
      if (opportunities.length === 0 || loadingItems) {
        setCheckboxStatus(false);
        return;
      }
      setCheckboxStatus(
        opportunities.every(opportunity =>
          selectedOpportunities.some(
            selOpportunity => selOpportunity.id === opportunity.id,
          ),
        ),
      );
    }, [opportunities, selectedOpportunities, loadingItems]);

    const columns = [
      { title: 'RELEVÂNCIA', value: OpportunityDetailsOrderEnum.RELEVANCE },
      { title: 'TIPO/OBS.', value: OpportunityDetailsOrderEnum.CATEGORY },
      { title: 'VALOR IS', value: OpportunityDetailsOrderEnum.SECURITY_AMOUNT },
      {
        title: 'TOMADOR/GRUPO',
        value: OpportunityDetailsOrderEnum.POLICYHOLDER,
      },
      {
        title: 'DT MAPEAMENTO',
        value: OpportunityDetailsOrderEnum.MAPPING_DATE,
      },
    ];

    const handleButtonClick = (
      orderBy: OpportunityDetailsOrderEnum,
      direction: 'asc' | 'desc',
    ) => {
      const dispatcher = () => {
        dispatch(
          opportunitiesDetailsActions.setOrderAndDirection({
            modality,
            orderBy,
            direction,
          }),
        );
      };
      return selectedOpportunities.length > 0
        ? renderOpportunitySelectionLossModal(
            selectionLossModalRef.current,
            dispatcher,
          )
        : dispatcher();
    };

    const handleCheckboxChange = (checked: boolean) => {
      const action = checked
        ? opportunitiesDetailsActions.addOpportunitiesToSelection
        : opportunitiesDetailsActions.removeOpportunitiesFromSelection;
      dispatch(action(opportunities));
    };

    const renderColumns = () => {
      return columns.map(column => {
        return (
          <div
            key={`header-column-${column.value}`}
            className={styles['opportunity-details-header__column']}
          >
            <p className={styles['opportunity-details-header__column-title']}>
              {column.title}
            </p>
            <div>
              <button
                type="button"
                data-testid={`btn-asc-${column.value.toLowerCase()}`}
                className={classNames(
                  styles['opportunity-details-header__order-btn'],
                  {
                    [styles['opportunity-details-header__order-btn--active']]:
                      orderBy === column.value &&
                      direction === 'asc' &&
                      totalOpportunities > 1,
                  },
                )}
                title="Ordernar crescente"
                onClick={() => handleButtonClick(column.value, 'asc')}
                disabled={loadingItems || totalOpportunities - 1 <= 0}
              >
                <i className="icon icon-chevron-up" />
              </button>
              <button
                type="button"
                data-testid={`btn-desc-${column.value.toLowerCase()}`}
                className={classNames(
                  styles['opportunity-details-header__order-btn'],
                  {
                    [styles['opportunity-details-header__order-btn--active']]:
                      orderBy === column.value &&
                      direction === 'desc' &&
                      totalOpportunities > 1,
                  },
                )}
                title="Ordernar decrescente"
                onClick={() => handleButtonClick(column.value, 'desc')}
                disabled={loadingItems || totalOpportunities - 1 <= 0}
              >
                <i className="icon icon-chevron-down" />
              </button>
            </div>
          </div>
        );
      });
    };

    return (
      <div className={styles['opportunity-details-header__wrapper']}>
        <div className={styles['opportunity-details-header__column']}>
          {checkable && (
            <Checkbox
              id="chk-select-all"
              checked={checkboxStatus}
              title="Selecionar todas as oportunidades na página"
              onChange={checked => handleCheckboxChange(checked)}
            />
          )}
        </div>
        {renderColumns()}
        <div ref={selectionLossModalRef} />
      </div>
    );
  };

export default OpportunityDetailsListHeader;

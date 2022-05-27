import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import {
  ModalityEnum,
  OpportunityDetailsOrderEnum,
} from '../../../application/types/model';
import {
  opportunitiesDetailsActions,
  selectSettingsByModality,
} from '../../../application/features/opportunitiesDetails/OpportunitiesDetailsSlice';
import styles from './OpportunityDetailsListHeader.module.scss';

export interface OpportunityDetailsListHeaderProps {
  modality: ModalityEnum;
}

const OpportunityDetailsListHeader: React.FC<OpportunityDetailsListHeaderProps> =
  ({ modality }) => {
    const dispatch = useDispatch();
    const { orderBy, direction } = useSelector(
      selectSettingsByModality(modality),
    ) || {
      orderBy: OpportunityDetailsOrderEnum.RELEVANCE,
      direction: 'desc',
    };

    const columns = [
      { title: 'RELEVÂNCIA', value: OpportunityDetailsOrderEnum.RELEVANCE },
      { title: 'TIPO/OBS.', value: OpportunityDetailsOrderEnum.CATEGORY },
      { title: 'VALOR IS', value: OpportunityDetailsOrderEnum.SECURITY_AMOUNT },
      { title: 'TOMADOR', value: OpportunityDetailsOrderEnum.POLICYHOLDER },
      {
        title: 'DT MAPEAMENTO',
        value: OpportunityDetailsOrderEnum.MAPPING_DATE,
      },
    ];

    const handleButtonClick = (
      orderBy: OpportunityDetailsOrderEnum,
      direction: 'asc' | 'desc',
    ) => {
      dispatch(
        opportunitiesDetailsActions.setOrderAndDirection({
          modality,
          orderBy,
          direction,
        }),
      );
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
                      orderBy === column.value && direction === 'asc',
                  },
                )}
                title="Ordernar crescente"
                onClick={() => handleButtonClick(column.value, 'asc')}
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
                      orderBy === column.value && direction === 'desc',
                  },
                )}
                title="Ordernar decrescente"
                onClick={() => handleButtonClick(column.value, 'desc')}
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
        {renderColumns()}
      </div>
    );
  };

export default OpportunityDetailsListHeader;

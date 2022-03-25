import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Divider, Pagination, Skeleton, Dropdown } from 'junto-design-system';
import { nanoid } from 'nanoid';
import { thousandSeparator } from '@shared/utils';
import OpportunityDetailsListHeader from '../OpportunityDetailsListHeader';
import OpportunityDetailsListItem from '../OpportunityDetailsListItem';
import { OpportunityDetailsListItemSkeleton } from '../Skeletons';
import { ModalityEnum } from '../../../application/types/model';
import { OpportunityDetailsItemDTO } from '../../../application/types/dto';
import {
  selectSettingsByModality,
  opportunitiesDetailsActions,
} from '../../../application/features/opportunitiesDetails/OpportunitiesDetailsSlice';
import OpportunitiesDetailsApi from '../../../application/features/opportunitiesDetails/OpportunitiesDetailsApi';
import { getLabelByModality } from '../../../helpers';
import styles from './OpportunityDetailsList.module.scss';

interface OpportunityDetailsListProps {
  modality: ModalityEnum;
}

const OpportunityDetailsList: React.FC<OpportunityDetailsListProps> = ({
  modality,
}) => {
  const dispatch = useDispatch();
  const { activePage, pageSize } = useSelector(
    selectSettingsByModality(modality),
  ) || {
    activePage: 1,
    pageSize: 10,
    modality,
  };

  const [loadingItems, setLoadingItems] = useState(true);
  const [data, setData] = useState<OpportunityDetailsItemDTO[]>();
  const [totalCount, setTotalCount] = useState<number>();
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchOpportunityDetails = () => {
      setLoadingItems(true);
      OpportunitiesDetailsApi.getOpportunitiesDetailsByModality(
        modality,
        activePage,
        pageSize,
      )
        .then(response => {
          setTotalCount(response.totalCount);
          setData(response.data);
        })
        .catch(() => setError(true))
        .finally(() => setLoadingItems(false));
    };

    fetchOpportunityDetails();
  }, [activePage, pageSize, modality]);

  const handlePaging = (page: number) => {
    dispatch(opportunitiesDetailsActions.setActivePage({ page, modality }));
  };

  const handleSelectPageSize = (value: any) => {
    const pageSize = Number(value);
    dispatch(opportunitiesDetailsActions.setActivePage({ page: 1, modality }));
    dispatch(opportunitiesDetailsActions.setPageSize({ pageSize, modality }));
  };

  const renderListItems = () => {
    if (loadingItems || !data) {
      return Array.from({ length: pageSize }, () => (
        <OpportunityDetailsListItemSkeleton key={nanoid(5)} />
      ));
    }
    return data.map(opportunity => {
      return (
        <OpportunityDetailsListItem
          key={`opportunity-details-listitem-${nanoid(5)}`}
          modality={modality}
          opportunity={opportunity}
        />
      );
    });
  };

  return (
    <div className={styles['opportunity-details-list__wrapper']}>
      <h3 className={styles['opportunity-details-list__title']}>
        Detalhes das oportunidades {getLabelByModality(modality, '', true)}
      </h3>
      <div className={styles['opportunity-details-list__box']}>
        {error ? (
          <div className={styles['opportunity-details-list__error']}>
            Ocorreu um erro inesperado ao consultar as oportunidades.
          </div>
        ) : (
          <>
            <p className={styles['opportunity-details-list__total-label']}>
              {totalCount !== undefined ? (
                `${thousandSeparator(
                  totalCount,
                )} oportunidades listadas, incluindo expiradas`
              ) : (
                <Skeleton width={250} height={8} />
              )}
            </p>
            <Divider />
            <div className={styles['opportunity-details-list__list-container']}>
              <OpportunityDetailsListHeader />
              {renderListItems()}
            </div>
          </>
        )}
      </div>
      {totalCount !== undefined && totalCount > 10 && (
        <div className={styles['opportunity-details-list__paging-container']}>
          <div
            className={styles['opportunity-details-list__pagesize-selector']}
          >
            <p>Mostrando</p>
            <Dropdown
              label=""
              placeholder=""
              value={{
                label: pageSize.toString(),
                value: pageSize.toString(),
              }}
              options={[
                { label: '10', value: '10' },
                { label: '25', value: '25' },
                { label: '50', value: '50' },
              ]}
              onValueSelected={item => handleSelectPageSize(item.value)}
            />
          </div>
          <div>
            <Pagination
              activePage={activePage}
              itemsPerPage={pageSize}
              totalItemsCount={totalCount || 0}
              onChange={handlePaging}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OpportunityDetailsList;

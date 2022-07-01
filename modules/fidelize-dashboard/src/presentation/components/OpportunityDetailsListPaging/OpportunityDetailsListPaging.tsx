import { Dropdown, Pagination } from 'junto-design-system';
import { useDispatch, useSelector } from 'react-redux';
import {
  opportunitiesDetailsActions,
  selectSettingsByModality,
} from '../../../application/features/opportunitiesDetails/OpportunitiesDetailsSlice';
import { ModalityEnum } from '../../../application/types/model';
import styles from './OpportunityDetailsListPaging.module.scss';

interface OpportunityDetailsListPagingProps {
  totalCount: number;
  modality: ModalityEnum;
}

const OpportunityDetailsListPaging: React.FC<OpportunityDetailsListPagingProps> =
  ({ totalCount, modality }) => {
    const dispatch = useDispatch();
    const { activePage, pageSize } = useSelector(
      selectSettingsByModality(modality),
    ) || {
      activePage: 1,
      pageSize: 10,
    };

    const handlePaging = (page: number) => {
      dispatch(opportunitiesDetailsActions.setActivePage({ page, modality }));
    };

    const handleSelectPageSize = (value: any) => {
      const pageSize = Number(value);
      dispatch(
        opportunitiesDetailsActions.setActivePage({ page: 1, modality }),
      );
      dispatch(opportunitiesDetailsActions.setPageSize({ pageSize, modality }));
    };

    return (
      <div className={styles['opportunity-details-list-paging__container']}>
        <div
          className={styles['opportunity-details-list-paging__size-selector']}
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
    );
  };

export default OpportunityDetailsListPaging;

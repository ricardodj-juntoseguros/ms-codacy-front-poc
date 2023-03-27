import { Dropdown, Pagination } from 'junto-design-system';
import { useDispatch, useSelector } from 'react-redux';
import {
  mappingRequestsListSliceActions,
  selectSettingsByMappingStatus,
} from '../../../application/features/mappingRequestsList/MappingRequestsListSlice';
import { MappingStatusEnum } from '../../../application/types/model';
import styles from './MappingRequestsPaging.module.scss';

interface MappingRequestPagingProps {
  mappingStatus: MappingStatusEnum;
  totalRequests: number;
}

const MappingRequestPaging: React.FC<MappingRequestPagingProps> = ({
  mappingStatus,
  totalRequests,
}) => {
  const dispatch = useDispatch();
  const { activePage, pageSize } = useSelector(
    selectSettingsByMappingStatus(mappingStatus),
  ) || { activePage: 1, pageSize: 10 };

  const handlePaging = (page: number) => {
    dispatch(
      mappingRequestsListSliceActions.setActivePage({
        status: mappingStatus,
        page,
      }),
    );
  };

  const handleSelectPageSize = (value: any) => {
    const pageSize = Number(value);
    dispatch(
      mappingRequestsListSliceActions.setActivePage({
        status: mappingStatus,
        page: 1,
      }),
    );
    dispatch(
      mappingRequestsListSliceActions.setPageSize({
        status: mappingStatus,
        pageSize,
      }),
    );
  };

  return (
    <div className={styles['mapping-requests-paging__container']}>
      <div className={styles['mapping-requests-paging__size-selector']}>
        <p>Mostrando</p>
        <Dropdown
          label=""
          placeholder=""
          variant="medium"
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
          totalItemsCount={totalRequests || 0}
          onChange={handlePaging}
        />
      </div>
    </div>
  );
};

export default MappingRequestPaging;

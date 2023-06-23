import { Dropdown, Pagination } from 'junto-design-system';
import { useDispatch, useSelector } from 'react-redux';
import { useRef } from 'react';
import { renderMappingEditionLossModal } from '../../../helpers/renderMappingEditionLossModal';
import {
  selectModalEdition,
  setEditorId,
} from '../../../application/features/modalMapping/ModalMappingSlice';
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
  const { editorId } = useSelector(selectModalEdition);
  const editionLossModalRef = useRef<HTMLDivElement>(null);
  const { activePage, pageSize } = useSelector(
    selectSettingsByMappingStatus(mappingStatus),
  ) || { activePage: 1, pageSize: 10 };
  const handlePaging = (page: number) => {
    !editorId
      ? dispatch(
          mappingRequestsListSliceActions.setActivePage({
            status: mappingStatus,
            page,
          }),
        )
      : renderMappingEditionLossModal(
          editionLossModalRef.current,
          () => {
            dispatch(setEditorId({ edit: 0, scroll: 0 }));
            dispatch(
              mappingRequestsListSliceActions.setActivePage({
                status: mappingStatus,
                page,
              }),
            );
          },
          true,
        );
  };

  const handleSelectPageSize = (value: any) => {
    const pageSize = Number(value);
    dispatch(setEditorId({ edit: 0, scroll: 0 }));
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
    <>
      <div ref={editionLossModalRef} />
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
            onValueSelected={item =>
              !editorId
                ? handleSelectPageSize(item.value)
                : renderMappingEditionLossModal(
                    editionLossModalRef.current,
                    () => {
                      handleSelectPageSize(item.value);
                    },
                    true,
                  )
            }
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
    </>
  );
};

export default MappingRequestPaging;

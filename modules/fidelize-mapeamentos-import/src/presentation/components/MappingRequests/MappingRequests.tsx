import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MappingStatusEnum } from '../../../application/types/model';
import ListingMappingApi from '../../../application/features/listingMapping/ListingMappingApi';
import MappingRequestPaging from '../MappingRequestsPaging';
import OngoingMappingRequestsList from '../OngoingMappingRequestsList';
import styles from './MappingRequests.module.scss';
import {
  selectSettingsByMappingStatus,
  mappingRequestsListSliceActions,
} from '../../../application/features/mappingRequestsList/MappingRequestsListSlice';
import ListingUnavailable from '../ListingUnavailable';
import DoneMappingRequestsList from '../DoneMappingRequestsList/DoneMappingRequestsList';
import BlockedMappingRequestsList from '../BlockedMappingRequestsList/BlockedMappingRequestsList';

interface MappingRequestsProps {
  mappingStatus: MappingStatusEnum;
  onChangeCallback?: () => void;
}

const MappingRequests: React.FC<MappingRequestsProps> = ({
  mappingStatus,
  onChangeCallback,
}) => {
  const dispatch = useDispatch();
  const { activePage, pageSize } = useSelector(
    selectSettingsByMappingStatus(mappingStatus),
  ) || { activePage: 1, pageSize: 10 };
  const [requestsData, setRequestsData] = useState<any[]>([]);
  const [totalRequests, setTotalRequests] = useState<number>();
  const [loadingRequests, setLoadingRequests] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const handleRemoveRequest = () => {
    if (requestsData?.length === 1) {
      dispatch(
        mappingRequestsListSliceActions.setActivePage({
          status: mappingStatus,
          page: activePage !== 1 ? activePage - 1 : 1,
        }),
      );
    }
    setLoadingRequests(true);
    fetchMappingRequests();
    onChangeCallback ? onChangeCallback() : '';
  };

  const fetchMappingRequests = () => {
    new ListingMappingApi()
      .getListingMapping(activePage, pageSize, mappingStatus)
      .then(response => {
        setError(false);
        setRequestsData(response.records);
        setTotalRequests(response.numberOfRecords);
      })
      .catch(() => setError(true))
      .finally(() => setLoadingRequests(false));
  };

  useEffect(() => {
    setLoadingRequests(true);
    fetchMappingRequests();
  }, [activePage, pageSize, mappingStatus]);

  const renderList = () => {
    if (mappingStatus === MappingStatusEnum.ON_QUEUE) {
      return (
        <OngoingMappingRequestsList
          mappingStatus={mappingStatus}
          loading={loadingRequests}
          requests={requestsData || []}
          onChangeCallback={() => {
            handleRemoveRequest();
          }}
        />
      );
    }

    if (mappingStatus === MappingStatusEnum.BLOCKED) {
      return (
        <BlockedMappingRequestsList
          mappingStatus={mappingStatus}
          loading={loadingRequests}
          requests={requestsData || []}
          onChangeCallback={() => {
            handleRemoveRequest();
          }}
        />
      );
    }

    if (mappingStatus === MappingStatusEnum.DONE) {
      return (
        <DoneMappingRequestsList
          mappingStatus={mappingStatus}
          loading={loadingRequests}
          requests={requestsData || []}
        />
      );
    }
    return null;
  };

  if (error) return <ListingUnavailable />;
  return (
    <div className={styles['mapping-requests__wrapper']}>
      {renderList()}
      {!!requestsData && requestsData.length !== 0 && (
        <MappingRequestPaging
          mappingStatus={mappingStatus}
          totalRequests={totalRequests || 0}
        />
      )}
    </div>
  );
};

export default MappingRequests;

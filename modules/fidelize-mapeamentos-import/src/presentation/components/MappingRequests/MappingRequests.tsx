import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { OngoingMappingRecord } from '../../../application/types/dto';
import { MappingStatusEnum } from '../../../application/types/model';
import ListingMappingApi from '../../../application/features/listingMapping/ListingMappingApi';
import MappingRequestPaging from '../MappingRequestsPaging';
import OngoingMappingRequestsList from '../OngoingMappingRequestsList';
import styles from './MappingRequests.module.scss';
import { selectSettingsByMappingStatus } from '../../../application/features/mappingRequestsList/MappingRequestsListSlice';
import ListingUnavailable from '../ListingUnavailable';

interface MappingRequestsProps {
  mappingStatus: MappingStatusEnum;
}

const MappingRequests: React.FC<MappingRequestsProps> = ({ mappingStatus }) => {
  const { activePage, pageSize } = useSelector(
    selectSettingsByMappingStatus(mappingStatus),
  ) || { activePage: 1, pageSize: 10 };
  const [requestsData, setRequestsData] = useState<OngoingMappingRecord[]>([]);
  const [totalRequests, setTotalRequests] = useState<number>();
  const [loadingRequests, setLoadingRequests] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
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

    setLoadingRequests(true);
    fetchMappingRequests();
  }, [activePage, pageSize, mappingStatus]);

  const renderList = () => {
    if (mappingStatus === MappingStatusEnum.ON_QUEUE) {
      return (
        <OngoingMappingRequestsList
          mappingStatus={mappingStatus}
          loading={loadingRequests}
          requests={requestsData}
        />
      );
    }
    return null;
  };

  if (error) return <ListingUnavailable />;

  return (
    <div className={styles['mapping-requests__wrapper']}>
      {renderList()}
      <MappingRequestPaging
        mappingStatus={mappingStatus}
        totalRequests={totalRequests || 0}
      />
    </div>
  );
};

export default MappingRequests;

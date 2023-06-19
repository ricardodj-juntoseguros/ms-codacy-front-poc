import { useSelector } from 'react-redux';
import { nanoid } from 'nanoid/non-secure';
import { RequestMappingRecord } from '../../../application/types/dto';
import { selectSettingsByMappingStatus } from '../../../application/features/mappingRequestsList/MappingRequestsListSlice';
import BlockedMappingRequestsListHeader from '../BlockedMappingRequestsListHeader';
import BlockedMappingRequestsListitem from '../BlockedMappingRequestsListitem';
import styles from './BlockedMappingRequestsList.module.scss';
import { MappingStatusEnum } from '../../../application/types/model';
import { OngoingRequestsListitemSkeleton } from '../Skeletons';
import EmptyRequestsListing from '../EmptyRequestsListing';

interface BlockedMappingRequestsListProps {
  mappingStatus: MappingStatusEnum;
  requests: RequestMappingRecord[];
  loading: boolean;
  onChangeCallback: () => void;
}

const BlockedMappingRequestsList: React.FC<BlockedMappingRequestsListProps> = ({
  mappingStatus,
  requests,
  loading,
  onChangeCallback,
}) => {
  const { pageSize } = useSelector(
    selectSettingsByMappingStatus(mappingStatus),
  ) || { pageSize: 10 };

  const renderListItems = () => {
    return (
      <>
        <div className={styles['blocked-mapping-requests-list__items']}>
          {requests.map(request => (
            <BlockedMappingRequestsListitem
              key={nanoid(5)}
              mappingRequest={request}
              onChangeCallback={() => onChangeCallback()}
            />
          ))}
        </div>
      </>
    );
  };

  const renderSkeleton = () => {
    return Array.from({ length: pageSize }, () => (
      <OngoingRequestsListitemSkeleton key={nanoid(5)} />
    ));
  };

  if (!loading && requests.length === 0)
    return <EmptyRequestsListing mappingStatus={mappingStatus} />;
  return (
    <div
      className={styles['blocked-mapping-requests-list__wrapper']}
      data-testid="blocked-mapping-requests-list"
    >
      <BlockedMappingRequestsListHeader />
      <div className={styles['blocked-mapping-requests-list__box']}>
        {loading ? renderSkeleton() : renderListItems()}
      </div>
    </div>
  );
};

export default BlockedMappingRequestsList;

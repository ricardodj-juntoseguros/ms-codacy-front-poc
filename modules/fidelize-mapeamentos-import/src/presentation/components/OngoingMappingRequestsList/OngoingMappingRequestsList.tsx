import { useSelector } from 'react-redux';
import { nanoid } from 'nanoid/non-secure';
import { OngoingMappingRecord } from '../../../application/types/dto';
import { selectSettingsByMappingStatus } from '../../../application/features/mappingRequestsList/MappingRequestsListSlice';
import OngoingMappingRequestsListHeader from '../OngoingMappingRequestsListHeader';
import OngoingMappingRequestsListitem from '../OngoingMappingRequestsListitem/OngoingMappingRequestsListitem';
import styles from './OngoingMappingRequestsList.module.scss';
import { MappingStatusEnum } from '../../../application/types/model';
import { OngoingRequestsListitemSkeleton } from '../Skeletons';
import EmptyRequestsListing from '../EmptyRequestsListing';

interface OngoingMappingRequestsListProps {
  mappingStatus: MappingStatusEnum;
  requests: OngoingMappingRecord[];
  loading: boolean;
  onRemoveCallback: () => void;
}

const OngoingMappingRequestsList: React.FC<OngoingMappingRequestsListProps> = ({
  mappingStatus,
  requests,
  loading,
  onRemoveCallback,
}) => {
  const { pageSize } = useSelector(
    selectSettingsByMappingStatus(mappingStatus),
  ) || { pageSize: 10 };

  const renderListItems = () => {
    return (
      <>
        <div className={styles['ongoing-mapping-requests-list__items']}>
          {requests.map(request => (
            <OngoingMappingRequestsListitem
              key={nanoid(5)}
              mappingRequest={request}
              onRemoveCallback={() => onRemoveCallback()}
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
      className={styles['ongoing-mapping-requests-list__wrapper']}
      data-testid="ongoing-mapping-requests-list"
    >
      <OngoingMappingRequestsListHeader />
      <div className={styles['ongoing-mapping-requests-list__box']}>
        {loading ? renderSkeleton() : renderListItems()}
      </div>
    </div>
  );
};

export default OngoingMappingRequestsList;

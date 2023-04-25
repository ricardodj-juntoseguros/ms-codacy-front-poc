import { useSelector } from 'react-redux';
import { nanoid } from 'nanoid/non-secure';
import { DoneMappingRecord } from '../../../application/types/dto';
import { selectSettingsByMappingStatus } from '../../../application/features/mappingRequestsList/MappingRequestsListSlice';
import DoneMappingRequestsListHeader from '../DoneMappingRequestsListHeader';
import DoneMappingRequestsListitem from '../DoneMappingRequestsListitem';
import styles from './DoneMappingRequestsList.module.scss';
import { MappingStatusEnum } from '../../../application/types/model';
import EmptyRequestsListing from '../EmptyRequestsListing';
import { DoneRequestsListitemSkeleton } from '../Skeletons/DoneRequestsListitemSkeleton';

interface DoneMappingRequestsListProps {
  mappingStatus: MappingStatusEnum;
  requests: DoneMappingRecord[];
  loading: boolean;
}

const DoneMappingRequestsList: React.FC<DoneMappingRequestsListProps> = ({
  mappingStatus,
  requests,
  loading,
}) => {
  const { pageSize } = useSelector(
    selectSettingsByMappingStatus(mappingStatus),
  ) || { pageSize: 10 };

  const renderListItems = () => {
    return (
      <>
        <div className={styles['done-mapping-requests-list__items']}>
          {requests.length > 0 &&
            requests.map(request => (
              <DoneMappingRequestsListitem
                key={nanoid(5)}
                mappingRequest={request}
              />
            ))}
        </div>
      </>
    );
  };

  const renderSkeleton = () => {
    return Array.from({ length: pageSize }, () => (
      <DoneRequestsListitemSkeleton key={nanoid(5)} />
    ));
  };

  if (!loading && requests.length === 0)
    return <EmptyRequestsListing mappingStatus={mappingStatus} />;
  return (
    <div
      className={styles['done-mapping-requests-list__wrapper']}
      data-testid="done-mapping-requests-list"
    >
      <DoneMappingRequestsListHeader />
      <div className={styles['done-mapping-requests-list__box']}>
        {loading ? renderSkeleton() : renderListItems()}
      </div>
    </div>
  );
};

export default DoneMappingRequestsList;

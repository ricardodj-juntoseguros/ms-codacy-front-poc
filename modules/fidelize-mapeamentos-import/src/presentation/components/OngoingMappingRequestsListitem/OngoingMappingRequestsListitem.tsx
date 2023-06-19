import { formatDateString, thousandSeparator } from '@shared/utils';
import classNames from 'classnames';
import { Tooltip } from 'junto-design-system';
import { useRef, useState } from 'react';
import { RequestMappingRecord } from '../../../application/types/dto';
import {
  QueueTypesEnum,
  MappingStatusEnum,
} from '../../../application/types/model';
import styles from './OngoingMappingRequestsListitem.module.scss';
import MappingRequestsListitemMenu from '../MappingRequestsListitemMenu/MappingRequestsListitemMenu';

interface OngoingMappingRequestsListitemProps {
  mappingRequest: RequestMappingRecord;
  onChangeCallback: () => void;
}

const OngoingMappingRequestsListitem: React.FC<OngoingMappingRequestsListitemProps> =
  ({ mappingRequest, onChangeCallback }) => {
    const {
      id,
      createdAt,
      policyholderName,
      policyholderEconomicGroupName,
      brokerName,
      category,
      queueTypes,
      statusId,
      isPriority,
      blocks,
    } = mappingRequest;

    const blockDivRef = useRef<HTMLDivElement>(null);
    const [showBlocks, setShowBlocks] = useState(false);

    const renderQueueColumn = (queueType: QueueTypesEnum) => {
      const queueData = queueTypes.find(qType => qType.id === queueType);
      let hasRequestedQueue = false;
      let opportunityCount: number | null = null;
      if (queueData !== undefined) {
        hasRequestedQueue = queueData.requested;
        opportunityCount = queueData.quantity;

        // Don't show count for CARF and DA
        if (
          queueType === QueueTypesEnum.CARF ||
          queueType === QueueTypesEnum.ACTIVE_DEBT
        ) {
          opportunityCount = null;
        }
      }
      const opportunityCountString = thousandSeparator(opportunityCount) || '-';

      return (
        <div className={styles['ongoing-mapping-requests-listitem__queue']}>
          <span
            className={classNames(
              styles['ongoing-mapping-requests-listitem__queue-badge'],
              {
                [styles[
                  'ongoing-mapping-requests-listitem__queue-badge--requested'
                ]]: hasRequestedQueue,
              },
            )}
            data-testid={`${id}-queue-${queueType}-${
              hasRequestedQueue ? 'requested' : 'not-requested'
            }`}
          />
          <p
            title={`${opportunityCountString}`}
            className={styles['ongoing-mapping-requests-listitem__label']}
          >
            {opportunityCountString}
          </p>
        </div>
      );
    };

    const handleTextBlocks = () => {
      let fullText = '';
      blocks?.forEach((block, index) => {
        fullText =
          fullText +
          block.description +
          (index < blocks.length - 1 ? '; ' : '.');
      });
      return fullText;
    };

    return (
      <div className={styles['ongoing-mapping-requests-listitem__wrapper']}>
        <div className={styles['ongoing-mapping-requests-listitem__column']}>
          <p className={styles['ongoing-mapping-requests-listitem__label']}>
            {formatDateString(createdAt, 'dd/MM/yy')}
          </p>
        </div>
        <div className={styles['ongoing-mapping-requests-listitem__column']}>
          <p
            className={classNames(
              styles['ongoing-mapping-requests-listitem__label'],
              styles['ongoing-mapping-requests-listitem__label--emphasys'],
            )}
            title={policyholderName}
          >
            {policyholderName}
          </p>
          {!!policyholderEconomicGroupName && (
            <span
              className={
                styles['ongoing-mapping-requests-listitem__label-helper']
              }
              title={policyholderEconomicGroupName}
            >
              {policyholderEconomicGroupName}
            </span>
          )}
        </div>
        <div className={styles['ongoing-mapping-requests-listitem__column']}>
          <p
            className={styles['ongoing-mapping-requests-listitem__label']}
            title={brokerName}
          >
            {brokerName}
          </p>
          <span
            className={
              styles['ongoing-mapping-requests-listitem__label-helper']
            }
          >
            {category}
          </span>
        </div>
        <div className={styles['ongoing-mapping-requests-listitem__column']}>
          {renderQueueColumn(QueueTypesEnum.LABOR)}
        </div>
        <div className={styles['ongoing-mapping-requests-listitem__column']}>
          {renderQueueColumn(QueueTypesEnum.FEDERAL)}
        </div>
        <div className={styles['ongoing-mapping-requests-listitem__column']}>
          {renderQueueColumn(QueueTypesEnum.STATE)}
        </div>
        <div className={styles['ongoing-mapping-requests-listitem__column']}>
          {renderQueueColumn(QueueTypesEnum.CARF)}
        </div>
        <div className={styles['ongoing-mapping-requests-listitem__column']}>
          {renderQueueColumn(QueueTypesEnum.ACTIVE_DEBT)}
        </div>
        <div className={styles['ongoing-mapping-requests-listitem__column']}>
          <div
            className={styles['ongoing-mapping-requests-listitem__statuses']}
          >
            {isPriority && (
              <span
                className={
                  styles['ongoing-mapping-requests-listitem__priority-tag']
                }
              >
                Urgente
              </span>
            )}
            {statusId !== null && (
              <span
                className={
                  styles['ongoing-mapping-requests-listitem__started-tag']
                }
              >
                Iniciado
              </span>
            )}
          </div>
        </div>

        <div className={styles['ongoing-mapping-requests-listitem__column']}>
          <div
            className={
              styles['ongoing-mapping-requests-listitem-actions__wrapper']
            }
          >
            {blocks?.length > 0 && (
              <div
                className={
                  styles[
                    'ongoing-mapping-requests-listitem-actions__show-tooltip'
                  ]
                }
                ref={blockDivRef}
              >
                <i
                  data-testid="show-tooltip"
                  onMouseEnter={() => setShowBlocks(true)}
                  onMouseLeave={() => setShowBlocks(false)}
                  className="icon-alert-circle"
                />
              </div>
            )}

            {statusId === 1 ||
              (statusId === null && (
                <MappingRequestsListitemMenu
                  policyholderName={policyholderName}
                  mappingId={id}
                  onChangeCallback={() => onChangeCallback()}
                />
              ))}
          </div>

          <Tooltip
            anchorRef={blockDivRef}
            text={handleTextBlocks()}
            visible={showBlocks}
            position="top"
          />
        </div>
      </div>
    );
  };

export default OngoingMappingRequestsListitem;

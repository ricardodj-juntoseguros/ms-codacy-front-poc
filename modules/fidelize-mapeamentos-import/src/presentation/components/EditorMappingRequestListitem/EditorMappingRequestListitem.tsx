import { Button, Checkbox, Toggle, makeToast } from 'junto-design-system';
import { useState, useRef, useMemo, memo } from 'react';
import { thousandSeparator } from '@shared/utils';
import classNames from 'classnames';
import { nanoid } from 'nanoid/non-secure';
import { useDispatch } from 'react-redux';

import { setEditorId } from '../../../application/features/modalMapping/ModalMappingSlice';
import ListingMappingApi from '../../../application/features/listingMapping/ListingMappingApi';
import {
  QueueType,
  RequestMappingUpdate,
} from '../../../application/types/dto';
import { QueueTypesEnum } from '../../../application/types/model';
import styles from './EditorMappingRequestListitem.module.scss';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import DeleteMappingRequestItem from '../DeleteMappingRequestItem/DeleteMappingRequestItem';

interface EditorMappingRequestListitemProps {
  queueTypes: QueueType[];
  isPriority: boolean;
  policyholderName: string;
  id: number;
  onChangeCallback: () => void;
}

const EditorMappingRequestListitem: React.FC<EditorMappingRequestListitemProps> =
  ({ id, queueTypes, isPriority, policyholderName, onChangeCallback }) => {
    const wrapperEditRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [priority, setPriority] = useState<boolean>(isPriority);
    const [checkers, setCheckers] = useState({
      'queue-4': queueTypes.find(qType => qType.id === 4)?.requested,
      'queue-3': queueTypes.find(qType => qType.id === 3)?.requested,
      'queue-5': queueTypes.find(qType => qType.id === 5)?.requested,
      'queue-6': queueTypes.find(qType => qType.id === 6)?.requested,
      'queue-7': queueTypes.find(qType => qType.id === 7)?.requested,
    });

    const countChecked = useMemo(
      () => Object.values(checkers).filter(check => check).length,
      [checkers],
    );

    const updateData: RequestMappingUpdate = {
      Priority: isPriority,
      QueueType: [],
    };

    const fetchPutMappingItem = () => {
      setIsSubmitting(true);
      updateData.Priority = priority;
      Object.keys(checkers).forEach(key => {
        checkers[key as keyof typeof checkers]
          ? updateData.QueueType.push(Number(key.slice(-1)))
          : '';
      });

      new ListingMappingApi()
        .putMappingItem(id, updateData)
        .then(() => {
          setIsSubmitting(false);
          dispatch(setEditorId([0]));
          onChangeCallback();
        })
        .catch(() => {
          makeToast(
            'warning',
            'Ops, não conseguimos salvar suas alterações. Por favor, tente novamente.',
          );
        });
    };

    const switchPriority = () => {
      const newPriority = !priority;
      setPriority(newPriority);
    };

    const switchChecked = (checked: boolean, id: string) => {
      countChecked > 1 || checked
        ? setCheckers(prevCheckers => ({
            ...prevCheckers,
            [id]: checked,
          }))
        : setIsOpen(true);
    };

    const renderQueueColumn = (queueType: QueueTypesEnum) => {
      const queueData = queueTypes.find(qType => qType.id === queueType);
      let hasRequestedQueue = false;
      let opportunityCount: number | null = null;
      if (queueData !== undefined) {
        hasRequestedQueue = queueData.requested;
        opportunityCount = queueData.quantity;
      }

      const opportunityCountString = thousandSeparator(opportunityCount) || '';

      return (
        <div
          data-testid="checkers"
          className={styles['editor-mapping-requests-listitem__queue']}
        >
          <span
            className={classNames(
              styles[
                'editor-mapping-requests-listitem__queue-badge--requested'
              ],
              {
                [styles[
                  'editor-mapping-requests-listitem__queue-badge--requested'
                ]]: hasRequestedQueue,
              },
            )}
            data-testid={`${nanoid(2)}-queue-${queueType}-${
              hasRequestedQueue ? 'requested' : 'not-requested'
            }`}
          />

          <Checkbox
            id={`chk-select-${nanoid(2)}`}
            data-name={`checker-${nanoid(2)}`}
            checked={checkers[`queue-${queueType}`] || false}
            title=""
            onChange={e => {
              switchChecked(e, `queue-${queueType}`);
            }}
          />

          <p
            title={`${opportunityCountString}`}
            className={styles['editor-mapping-requests-listitem__label']}
          >
            {opportunityCount && opportunityCount > 0
              ? opportunityCountString
              : ''}
          </p>
        </div>
      );
    };
    return (
      <>
        <div className={styles['editor-mapping-requests-listitem__column']}>
          {renderQueueColumn(QueueTypesEnum.LABOR)}
        </div>
        <div className={styles['editor-mapping-requests-listitem__column']}>
          {renderQueueColumn(QueueTypesEnum.FEDERAL)}
        </div>
        <div className={styles['editor-mapping-requests-listitem__column']}>
          {renderQueueColumn(QueueTypesEnum.STATE)}
        </div>
        <div className={styles['editor-mapping-requests-listitem__column']}>
          {renderQueueColumn(QueueTypesEnum.CARF)}
        </div>
        <div className={styles['editor-mapping-requests-listitem__column']}>
          {renderQueueColumn(QueueTypesEnum.ACTIVE_DEBT)}
        </div>
        <div className={styles['editor-mapping-requests-listitem__column']}>
          <div
            ref={wrapperEditRef}
            className={
              styles['editor-mapping-requests-listitem-edit-actions__wrapper']
            }
          >
            <Toggle
              id="toggle-status-edit"
              data-testid="toggle-status-edit"
              name="toggle-status-edit"
              checked={priority}
              onChange={() => {
                switchPriority();
              }}
              label={priority ? 'Priorizar' : 'Normal'}
            />

            <Button
              data-testid="confirm-update-btn"
              onClick={() => {
                fetchPutMappingItem();
              }}
              size="small"
            >
              {isSubmitting ? ((<LoadingSpinner />) as any) : 'Salvar'}
            </Button>

            <Button
              data-testid="cancel-update-btn"
              onClick={() => {
                dispatch(setEditorId([0]));
              }}
              variant="secondary"
              size="small"
            >
              Cancelar
            </Button>
          </div>
        </div>
        {isOpen && (
          <DeleteMappingRequestItem
            mappingId={id}
            policyholderName={policyholderName}
            onChangeCallback={onChangeCallback}
          />
        )}
      </>
    );
  };

export default memo(EditorMappingRequestListitem);

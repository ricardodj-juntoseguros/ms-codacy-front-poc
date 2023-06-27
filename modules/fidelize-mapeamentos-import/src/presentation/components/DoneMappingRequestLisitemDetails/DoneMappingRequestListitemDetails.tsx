/* eslint-disable no-nested-ternary */
/* eslint-disable react/button-has-type */
import {
  federalIdFormatter,
  formatDateString,
  thousandSeparator,
} from '@shared/utils';

import { Alert, LinkButton, makeToast } from 'junto-design-system';
import {
  DoneDetailsQueueType,
  MappingDoneDetailsDTO,
} from '../../../application/types/dto';
import styles from './DoneMappingRequestListitemDetails.module.scss';
import ListingMappingApi from '../../../application/features/listingMapping/ListingMappingApi';

interface DoneMappingRequestsListitemProps {
  mappingRequest: MappingDoneDetailsDTO;
}

const DoneMappingRequestsListitemDetails: React.FC<DoneMappingRequestsListitemProps> =
  ({ mappingRequest }) => {
    const {
      id,
      isPriority,
      policyholderFederalId,
      createdBy,
      createdAt,
      blocks,
      queueTypes,
    } = mappingRequest;

    const downloadLink = document.createElement('a');

    const fetchDownloadOpportunity = (name: string, type: number) => {
      new ListingMappingApi()
        .downloadMappingItem(id, type)
        .then(response => {
          const opportunity = window.URL.createObjectURL(
            new Blob([response], {
              type: response.type,
            }),
          );

          downloadLink.href = opportunity;
          downloadLink.innerHTML = 'Download - opportunity';
          downloadLink.download = `${policyholderFederalId}-${name}`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        })
        .catch(() => {
          makeToast(
            'error',
            'Ops, parece que algo deu errado. Tente novamente.',
          );
        });
    };

    const showDescriptionOrValue = (queue: any, type: string) => {
      const result =
        queue.statusId === 2 && type !== 'totalProcesses'
          ? ''
          : queue.statusId < 3
          ? queue.statusDescription
          : thousandSeparator(queue[type]);
      return result;
    };

    const showDescriptionOrDate = (queue: DoneDetailsQueueType) => {
      const result = queue.mappedAt
        ? formatDateString(queue.mappedAt, 'dd/MM/yy')
        : queue.statusId === 1
        ? '-'
        : queue.statusDescription;
      return result;
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

    const renderRequestDetailsColumns = (hasBlocks: boolean) => {
      const requestDate = (
        <>
          <span>Solicitação criada em</span>
          <div>{formatDateString(createdAt, 'dd/MM/yy')}</div>
        </>
      );
      const requestPolicyholder = (
        <>
          <span>CNPJ do Tomador</span>
          <div>{federalIdFormatter(policyholderFederalId)}</div>
        </>
      );
      const requestedBy = (
        <>
          <span>Solicitação criada por</span>
          <div>{createdBy}</div>
        </>
      );
      const requestPriority = (
        <>
          <span>Nível de prioridade da solicitação</span>
          <div>{isPriority ? 'Urgente' : 'Normal'}</div>
        </>
      );

      if (hasBlocks) {
        return (
          <div
            className={styles['done-mapping-requests-listitem-details__column']}
          >
            <div
              className={
                styles[
                  'done-mapping-requests-listitem-no-blocks-divide__wrapper'
                ]
              }
            >
              <div>
                <div
                  className={
                    styles[
                      'done-mapping-requests-listitem-details__column--block-line-top'
                    ]
                  }
                >
                  {requestDate}
                </div>
                <div
                  className={
                    styles[
                      'done-mapping-requests-listitem-details__column--block-line-bottom'
                    ]
                  }
                >
                  {requestPolicyholder}
                </div>
              </div>

              <div>
                <div
                  className={
                    styles[
                      'done-mapping-requests-listitem-details__column--block-line-top'
                    ]
                  }
                >
                  {requestedBy}
                </div>
                <div
                  className={
                    styles[
                      'done-mapping-requests-listitem-details__column--block-line-bottom'
                    ]
                  }
                >
                  {requestPriority}
                </div>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div
          className={
            styles['done-mapping-requests-listitem-no-blocks__wrapper']
          }
        >
          <div
            className={styles['done-mapping-requests-listitem-details__column']}
          >
            {requestDate}
          </div>
          <div
            className={styles['done-mapping-requests-listitem-details__column']}
          >
            {requestedBy}
          </div>
          <div
            className={styles['done-mapping-requests-listitem-details__column']}
          >
            {requestPolicyholder}
          </div>
          <div
            className={styles['done-mapping-requests-listitem-details__column']}
          >
            {requestPriority}
          </div>
        </div>
      );
    };

    return (
      <div
        className={styles['done-mapping-requests-listitem-details__container']}
      >
        {queueTypes?.map(queue => (
          <div
            key={queue.id}
            className={
              styles['done-mapping-requests-listitem-details__wrapper']
            }
          >
            <div
              className={
                styles['done-mapping-requests-listitem-details__column']
              }
            >
              {showDescriptionOrDate(queue)}
            </div>

            <div
              className={
                styles[
                  'done-mapping-requests-listitem-details__column--emphasys'
                ]
              }
            >
              <div>{queue.name}</div>
            </div>
            <div
              className={
                styles['done-mapping-requests-listitem-details__column']
              }
            >
              {showDescriptionOrValue(queue, 'totalProcesses')}
            </div>
            <div
              className={
                styles['done-mapping-requests-listitem-details__column']
              }
            >
              {showDescriptionOrValue(queue, 'totalOpenProcesses')}
            </div>
            <div
              className={
                styles['done-mapping-requests-listitem-details__column']
              }
            >
              {showDescriptionOrValue(queue, 'totalOpportunities')}
            </div>
            <div
              className={
                styles['done-mapping-requests-listitem-details__column']
              }
            >
              {queue.mappedAt && queue.totalOpportunities > 0 && (
                <LinkButton
                  data-testid="download-opportunity-btn"
                  label=""
                  icon="download"
                  onClick={() => fetchDownloadOpportunity(queue.name, queue.id)}
                />
              )}
            </div>
          </div>
        ))}
        {blocks?.length > 0 ? (
          <div
            className={
              styles['done-mapping-requests-listitem-on-blocks__wrapper']
            }
          >
            {renderRequestDetailsColumns(true)}
            <div
              className={
                styles[
                  'done-mapping-requests-listitem-details__column--on-blocks'
                ]
              }
            >
              <Alert
                variant="neutral"
                text={handleTextBlocks()}
                icon="alert-circle"
                width={540}
              />
            </div>
          </div>
        ) : (
          renderRequestDetailsColumns(false)
        )}
      </div>
    );
  };

export default DoneMappingRequestsListitemDetails;

/* eslint-disable react/button-has-type */
import { formatDateString } from '@shared/utils';
import classNames from 'classnames';
import { useRef, useState } from 'react';
import { Tooltip, makeToast } from 'junto-design-system';
import ListingMappingApi from '../../../application/features/listingMapping/ListingMappingApi';
import { DoneMappingRecord } from '../../../application/types/dto';
import DoneMappingRequestsListitemDetails from '../DoneMappingRequestLisitemDetails';
import styles from './DoneMappingRequestsListitem.module.scss';

interface DoneMappingRequestsListitemProps {
  mappingRequest: DoneMappingRecord;
}

const DoneMappingRequestsListitem: React.FC<DoneMappingRequestsListitemProps> =
  ({ mappingRequest }) => {
    const {
      policyholderEconomicGroupName,
      id,
      mappedAt,
      policyholderName,
      brokerName,
      category,
      statusDescription,
      totalProcesses,
      totalOpenProcesses,
      totalOpportunities,
      blocks,
    } = mappingRequest;

    const [showDetails, setShowDetails] = useState(false);
    const [onHover, setOnHover] = useState(false);
    const [details, setDetails] = useState<any>([]);
    const blockDivRef = useRef<HTMLDivElement>(null);

    const fetchDetailsMappingRequest = () => {
      !showDetails
        ? new ListingMappingApi()
            .getDetailsListingMapping(id)
            .then(response => {
              if (!response.errors) {
                setDetails(response);
                setShowDetails(!showDetails);
              } else {
                makeToast('warning', response.errors[0].message);
              }
            })
            .catch(() =>
              makeToast(
                'warning',
                'Os detalhes desta solicitação não estão disponíveis no momento. Tente novamente mais tarde.',
              ),
            )
        : setShowDetails(false);
    };

    const handleTextBlocks = () => {
      let fullText = '';
      blocks.forEach((block, index) => {
        fullText =
          fullText +
          block.description +
          (index < blocks.length - 1 ? '; ' : '.');
      });
      return fullText;
    };

    return (
      <>
        <div
          className={classNames(
            styles['done-mapping-requests-listitem__wrapper'],
            {
              [styles['done-mapping-requests-listitem__wrapper--open']]:
                showDetails,
            },
          )}
        >
          <div className={styles['done-mapping-requests-listitem__column']}>
            {mappedAt ? (
              <p className={styles['done-mapping-requests-listitem__label']}>
                {mappedAt && formatDateString(mappedAt, 'dd/MM/yy')}
              </p>
            ) : (
              <p className={styles['done-mapping-requests-listitem__no-date']}>
                {statusDescription}
              </p>
            )}
          </div>
          <div className={styles['done-mapping-requests-listitem__column']}>
            <p
              className={classNames(
                styles['done-mapping-requests-listitem__label'],
                styles['done-mapping-requests-listitem__label--emphasys'],
              )}
              title={policyholderName}
            >
              {policyholderName}
            </p>
            {!!policyholderEconomicGroupName && (
              <span
                className={
                  styles['done-mapping-requests-listitem__label-helper']
                }
                title={policyholderEconomicGroupName}
              >
                {policyholderEconomicGroupName}
              </span>
            )}
          </div>
          <div className={styles['done-mapping-requests-listitem__column']}>
            <p
              className={styles['done-mapping-requests-listitem__label']}
              title={brokerName}
            >
              {brokerName}
            </p>
            <span
              className={styles['done-mapping-requests-listitem__label-helper']}
            >
              {category}
            </span>
          </div>
          <div className={styles['done-mapping-requests-listitem__column']}>
            {totalProcesses}
          </div>
          <div className={styles['done-mapping-requests-listitem__column']}>
            {totalOpenProcesses}
          </div>
          <div className={styles['done-mapping-requests-listitem__column']}>
            {totalOpportunities}
          </div>
          <div className={styles['done-mapping-requests-listitem__column']}>
            <div
              className={
                styles['done-mapping-requests-listitem-actions__wrapper']
              }
            >
              {blocks?.length > 0 && (
                <div
                  ref={blockDivRef}
                  className={
                    styles[
                      'done-mapping-requests-listitem-actions__show-pop-up'
                    ]
                  }
                >
                  <i
                    data-testid="show-tooltip"
                    onMouseEnter={() => setOnHover(true)}
                    onMouseLeave={() => setOnHover(false)}
                    className="icon-alert-circle"
                  />
                </div>
              )}

              <div
                className={classNames(
                  styles['done-mapping-requests-listitem-actions__show-row'],
                  {
                    [styles[
                      'done-mapping-requests-listitem-actions__show-row--focused'
                    ]]: showDetails,
                  },
                )}
              >
                <button
                  data-testid="show-details-btn"
                  onClick={() => fetchDetailsMappingRequest()}
                >
                  <i className="icon-chevron-down" />
                </button>
              </div>
            </div>
          </div>
        </div>
        {showDetails && (
          <DoneMappingRequestsListitemDetails mappingRequest={details} />
        )}

        <Tooltip
          anchorRef={blockDivRef}
          text={handleTextBlocks()}
          visible={onHover}
          position="top"
        />
      </>
    );
  };

export default DoneMappingRequestsListitem;

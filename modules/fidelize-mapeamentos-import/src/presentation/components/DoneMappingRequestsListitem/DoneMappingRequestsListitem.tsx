/* eslint-disable react/button-has-type */
import { formatDateString } from '@shared/utils';
import classNames from 'classnames';
import { useState } from 'react';
import { makeToast } from 'junto-design-system';
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
                styles['done-mapping-requests-listitem-actions__container']
              }
            >
              <ul
                data-testid="pop-up-menu"
                className={classNames(
                  styles['mapping-request-listitem-pop-up-options__wrapper'],
                  {
                    [styles[
                      'mapping-request-listitem-pop-up-options__wrapper--open'
                    ]]: onHover,
                  },
                )}
              >
                {blocks?.map((block, index) => (
                  <li
                    key={block.id}
                    className={
                      styles['mapping-request-listitem-pop-up__option']
                    }
                  >
                    {block.description}
                    {index < blocks.length - 1 ? ';' : '.'}
                  </li>
                ))}
              </ul>
            </div>
            <div
              className={
                styles['done-mapping-requests-listitem-actions__wrapper']
              }
            >
              {blocks.length > 0 && (
                <div
                  className={
                    styles[
                      'done-mapping-requests-listitem-actions__show-pop-up'
                    ]
                  }
                >
                  <i
                    data-testid="show-menu-pop-up"
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
      </>
    );
  };

export default DoneMappingRequestsListitem;

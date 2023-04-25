/* eslint-disable react/button-has-type */
import { formatDateString, thousandSeparator } from '@shared/utils';
import classNames from 'classnames';
import { useState } from 'react';
import { DoneMappingRecord } from '../../../application/types/dto';
import styles from './DoneMappingRequestsListitem.module.scss';

interface DoneMappingRequestsListitemProps {
  mappingRequest: DoneMappingRecord;
}

const DoneMappingRequestsListitem: React.FC<DoneMappingRequestsListitemProps> =
  ({ mappingRequest }) => {
    const {
      policyholderEconomicGroupName,
      mappedAt,
      policyholderName,
      brokerName,
      category,
      totalProcesses,
      totalOpenProcesses,
      totalOpportunities,
      blocks,
    } = mappingRequest;

    const [showDetails, setShowDetails] = useState(false);
    const [onHover, setOnHover] = useState(false);

    return (
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
              Iniciado
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
              className={styles['done-mapping-requests-listitem__label-helper']}
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
          {thousandSeparator(totalProcesses)}
        </div>
        <div className={styles['done-mapping-requests-listitem__column']}>
          {thousandSeparator(totalOpenProcesses)}
        </div>
        <div className={styles['done-mapping-requests-listitem__column']}>
          {thousandSeparator(totalOpportunities)}
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
                  className={styles['mapping-request-listitem-pop-up__option']}
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
                  styles['done-mapping-requests-listitem-actions__show-pop-up']
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
              <button onClick={() => setShowDetails(!showDetails)}>
                <i className="icon-chevron-down" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default DoneMappingRequestsListitem;
